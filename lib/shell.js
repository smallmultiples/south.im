const ORIGIN = (
  require('../config.json').generator.units / 2 /
  require('../config.json').terrain.chunk_size *
  require('../config.json').generator.scale
)
const START_BUTTON = require('../config.json').start_button
const CONTROLLABLE = require('../config.json').controllable
const CHUNK_SIZE = require('../config.json').terrain.chunk_size
const SCALE = require('../config.json').generator.scale
const POST_PROCESSING = require('../config.json').postprocessing
const TWEAKABLE = require('../config.json').tweakable
const MINIMAP = require('../config.json').minimap
const PRESET = require('../config.json').preset
const LOOP = require('../config.json').loop
const CAMERA_ROTATION = 0.0025 / 1000 * 30
const ANGLE_OFFSET = Math.PI
const CAMERA_DRAG = 1 - 0.25
const CAMERA_ANGLE = 0.125
const EGG_DRAG = 1 - 0.75
const MUTE = require('../config.json').mute

var gldefines = require('glsl-defines')
var defines = ''
+ gldefines(require('../config.json').defines_list)
+ gldefines(require('../config.json').defines_values)

var cameraPosition = require('./camera-position')
var createTexture = require('gl-texture2d')
var createCamera = require('orbit-camera')
var mat4 = require('gl-matrix').mat4
var quat = require('gl-matrix').quat
var vec3 = require('gl-matrix').vec3
var mousetrap = require('mousetrap')
var h = require('hyperscript')
var now = require('right-now')
var once = require('once')
var lut = require('lut')
var abs = Math.abs

var normalize = require('vectors/normalize')(3)
var detection = require('./detect-error')
var terrain = require('./terrain')
var meshify = require('./meshify')
var logo = require('./logo')
var s = require('./space')
var shell = module.exports = require('gl-now')({
  clearColor: [0, 0, 0, 1]
})

var start
var projection = new Float32Array(16)
var view = new Float32Array(16)
var finishcounter
var postcounter
var shaders
var lights
var camera
var shader
var egg

shell.on('gl-init', init)
shell.on('gl-error', function() {
  detection('WebGL', 'http://get.webgl.org/')
})

if (!!POST_PROCESSING) {
  // Non-intrusive post-processing
  require('pp-now')(shell
    , defines + require('../shaders/post-processing.frag')
  )

  shell.on('pp-render', render)
  shell.on('pp-uniforms', function(pp) {
    if (!start) return

    var lut1 = shell.params.curr['lut 1'].value
    var lut2 = shell.params.curr['lut 2'].value

    pp.uniforms.t = t
    pp.uniforms.r = Math.random()
    pp.uniforms.uNoiseAmount = 0.2
    pp.uniforms.uMosaic = shell.params.curr['mosaic amount'].value
    pp.uniforms.uHazeAmount = shell.params.curr['haze amount'].value
    pp.uniforms.uRGBShift = shell.params.curr['rgb shift'].value
    pp.uniforms.uVignette = shell.params.curr['vignette'].value
    pp.uniforms.uLUT1 = shell.grades[lut1].bind(2)
    pp.uniforms.uLUT2 = shell.grades[lut2].bind(3)
    pp.uniforms.uLUT_mix = shell.params.curr['lut mix'].value
  })
} else {
  shell.on('gl-render', render)
}

var snapcanvas = lut(33, 33, 33)
document.body.appendChild(snapcanvas)

snapcanvas.style.display = 'none'
snapcanvas.style.position = 'absolute'
snapcanvas.style.top = '0'
snapcanvas.style.left = '0'
snapcanvas.style.zIndex = 9999

// Hold shift to display a LUT in the
// top corner - then you can take a
// screenshot to use it for post-processing
mousetrap.bind('shift', function() {
  snapcanvas.style.display = 'block'
}, 'keydown')
mousetrap.bind('shift', function() {
  snapcanvas.style.display = 'none'
}, 'keyup')

// Log the current settings as JSON
// so that we can load them up later!
mousetrap.bind('`', function() {
  var params = shell.params.curr

  params = Object.keys(params).reduce(function(memo, key) {
    memo[key] = params[key].value
    if (memo[key].buffer) memo[key] = [].slice.call(memo[key])
    return memo
  }, {})

  console.log(JSON.stringify(params))
})


var eggPosition = [ORIGIN,ORIGIN]

function init() {
  var gl = shell.gl

  egg = meshify(gl, require('../models/egg-single.obj')[0])

  camera = createCamera()

  shell.camera = camera
  shell.finished = finished
  shell.params = require('./param-manager')(shell)
  shell.shaders = shaders = require('./shaders')(gl)
  shell.speakers = require('./speaker-manager')(gl)
  shell.field = require('./terrain-manager')
  shell.field.gl = gl

  shell.water = require('./water')(shell)
  shell.trees = require('./tree-manager')(shell)
  shell.shark = require('./shark-manager')(shell)
  shell.lights = require('./lighting')({
      directional: 2
    , point: 2
  })

  if (!!START_BUTTON && !LOOP && !TWEAKABLE) {
    var button = document.createElement('div')
    button.setAttribute('class', 'start-button')
    button.innerHTML = 'BEGIN'
    setTimeout(function() {
      button.setAttribute('class', 'start-button visible')
    }, 500)
    button.addEventListener('click', once(function() {
      button.setAttribute('class', 'start-button')

      var main = document.getElementById('main')
      if (main) main.setAttribute('class', 'fade-out')

      setTimeout(function() {
        button.style.display = 'none'
        boot()
      }, 1000)
      setTimeout(function() {
        if (main) main.style.display = 'none'
      }, 4000)
    }))
    document.body.appendChild(button)
  } else {
    process.nextTick(boot)
  }
}

function boot() {
  start = true
  shell.field.moveTo([
      s.map.chunk(ORIGIN)|0
    , s.map.chunk(ORIGIN)|0
  ])

  shell.timeline = require('./timeline')(shell)
  if (!TWEAKABLE) {
    shell.params.curr['egg brightness'].value = -1.5
    shell.song.volume = MUTE ? 0 : 1
    shell.song.play()
  } else {
    postcounter = now()
    finishcounter = 1
  }

  shell.beats = require('./beats')(shell)

  var presets = require('./presets.json')
  shell.preset = preset
  function preset(name) {
    if (!presets[name]) return
    var preset = presets[name]
    Object.keys(preset).forEach(function(key) {
      var val = preset[key]
      val = Array.isArray(val) ? new Float32Array(val) : val
      shell.params.curr[key].value = val
    })
  }

  if (PRESET && TWEAKABLE) shell.preset(PRESET)

  var pui = require('./param-ui')(shell, shell.params.curr)
  if (!!TWEAKABLE) {
    document.body.appendChild(pui)
  }

  Object.keys(shell.grades).forEach(function(key) {
    shell.grades[key] = createTexture(shell.gl, shell.grades[key])
  })
}

shell.setTime = function(_ct) {
  shell.song.currentTime = _ct / 1000
}

var last
var ct = 0
var lt = 0
var t = 0
function tick() {
  lt = ct
  ct += (((shell.song.currentTime * 1000) || 0) - ct) * 0.06125
  if (!TWEAKABLE) {
    shell.timeline.ui.tick(ct)
    shell.timeline.times.step(ct)
  }
  if (!(t++ % 15)) shell.field.moveTo([
      ((camera.center[0]) * (CHUNK_SIZE))|0
    , ((camera.center[2]) * (CHUNK_SIZE))|0
  ])
}

function render() {
  if (!start) return

  if (postcounter) {
    ct += ((now() - postcounter + finishcounter) - ct) * 0.06125
    if (!!TWEAKABLE) {
      tick()
    } else {
      shell.timeline.times.step(ct)
    }
  } else {
    tick()
    shell.audio.frequencies(shell.frequencies)
    shell.beatData = shell.beats(Math.abs(ct - lt))

    var audioAmplitude = 0
    for (var i = 0; i < 64; i += 1) {
      audioAmplitude += shell.frequencies[i] / 256
    }

    shell.amplitude = Math.max(0, audioAmplitude - 35)
  }


  /**
   * Initial Setup
   */
  var gl = shell.gl
  var params = shell.params.curr

  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)

  camera.distance = params['camera distance'].value
  quat.identity(camera.rotation)
  quat.rotateY(camera.rotation, camera.rotation, ct * CAMERA_ROTATION + ANGLE_OFFSET + params['camera spin'].value)
  quat.rotateX(camera.rotation, camera.rotation, -Math.PI*CAMERA_ANGLE - params['camera angle'].value)

  shell.clearColor = params['sky color'].value

  /**
   * Lighting
   */
  shell.lights.directionals[0].direction = params['directional dir 1'].value
  shell.lights.directionals[1].direction = params['directional dir 2'].value
  shell.lights.directionals[0].color     = params['directional color 1'].value
  shell.lights.directionals[1].color     = params['directional color 2'].value

  normalize(shell.lights.directionals[0])
  normalize(shell.lights.directionals[1])

  if (!!CONTROLLABLE) {
    var speed = shell.wasDown('shift') ? 0.2 : 0.02
    if (shell.wasDown('W') || shell.wasDown('up'))     eggPosition[1] -= speed
    if (shell.wasDown('S') || shell.wasDown('down'))   eggPosition[1] += speed
    if (shell.wasDown('A') || shell.wasDown('left'))   eggPosition[0] -= speed
    if (shell.wasDown('D') || shell.wasDown('right'))  eggPosition[0] += speed
  }

  // Setting the position of the primary point light,
  // which will in turn inform the position of the egg/seed/rock thing and camera.
  shell.lights.points[0].position[0] =  CONTROLLABLE ? eggPosition[0] : ORIGIN
  shell.lights.points[0].position[2] =  CONTROLLABLE ? eggPosition[1] : cameraPosition(ct)
  shell.lights.points[0].position[1] += (
      Math.max(
        terrain(
            shell.lights.points[0].position[0] * (CHUNK_SIZE - 1)
          , shell.lights.points[0].position[2] * (CHUNK_SIZE - 1)
        ), params['water level'].value
      ) + 0.15
    - shell.lights.points[0].position[1]
  ) * EGG_DRAG

  var b = params['egg brightness'].value
  var c = params['egg color'].value
  shell.lights.points[0].color[0] = c[0] * b
  shell.lights.points[0].color[1] = c[1] * b
  shell.lights.points[0].color[2] = c[2] * b

  if (!!MINIMAP) shell.minimap(
      (shell.lights.points[0].position[0] * (CHUNK_SIZE - 1) / SCALE)
    , (shell.lights.points[0].position[2] * (CHUNK_SIZE - 1) / SCALE)
  )

  /**
   * Camera Setup
   */
  shell.camera.center[0] += (shell.lights.points[0].position[0] - shell.camera.center[0]) * CAMERA_DRAG
  shell.camera.center[1] += (shell.lights.points[0].position[1] - shell.camera.center[1]) * CAMERA_DRAG
  shell.camera.center[2] += (shell.lights.points[0].position[2] - shell.camera.center[2]) * CAMERA_DRAG

  camera.view(view)
  mat4.perspective(projection
    , params.fov.value * Math.PI
    , shell.width / shell.height
    , 0.05
    , 1000
  )

  /**
   * Water
   */
  shader = bootstrapShader(shaders.water)
  shader.uniforms.uWaterColor = params['water color'].value
  shell.water.level = params['water level'].value
  shell.water.render(shader)

  /**
   * Trees
   */
  shader = bootstrapShader(shaders.tree)
  shader.attributes.aStump.location = 2
  shader.attributes.aCentroid.location = 3
  shader.attributes.aCenter.location = 4
  shell.trees.render(shader)

  /**
   * The "egg"
   */
  shader = bootstrapShader(shaders.egg)
  var model = mat4.identity(new Float32Array(16))
  var eggscale = 0.0275 + Math.max(0, shell.amplitude - 5) * 0.001
  eggscale = [eggscale, eggscale, eggscale]

  mat4.translate(model, model, shell.lights.points[0].position)
  mat4.scale(model, model, eggscale)
  mat4.rotateY(model, model, t * 0.08)

  shader.uniforms.uModel = model
  shader.uniforms.uEggColor = params['egg color'].value
  shader.uniforms.uAmplitude = shell.amplitude
  egg.mesh.bind()
  gl.drawArrays(gl.TRIANGLES, 0, egg.length)
  egg.mesh.unbind()

  /**
   * Sharks
   */
  shader = bootstrapShader(shaders.shark)
  shell.shark.render(shader)

  /**
   * Speaker Text
   */
  shader = bootstrapShader(shaders.speaker)
  shell.speakers.render(shader)

  /**
   * Terrain Rendering
   */
  shader = bootstrapShader(shaders.terrain)
  shader.uniforms.uWaterLevel = shell.water.level + 0.1
  shader.uniforms.uWaterColor = params['water color'].value
  shell.field.render(shader, projection, view, shell.camera.center)
}

function bootstrapShader(shader) {
  setShader(shader)
  updateProjection(shader)
  shell.lights.bind(shader)
  return shader
}

function updateProjection(shader) {
  shader.uniforms.uProjection = projection
  shader.uniforms.uView = view
  return shader
}

function setShader(shader) {
  shader.bind()
  shader.attributes.aPosition.location = 0
  shader.attributes.aNormal.location = 1
  shader.uniforms.t = ct / 100
  shader.uniforms.uSkyColor = shell.params.curr['sky color'].value
  shader.uniforms.uEggBrightness = shell.params.curr['egg brightness'].value
  return shader
}

function finished() {
  postcounter = now()
  finishcounter = ct
}
