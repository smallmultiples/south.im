const CHUNK_SIZE = require('../config.json').terrain.chunk_size
const CREATE_RADIUS = require('../config.json').terrain.create_radius
const SAFETY_RADIUS = require('../config.json').terrain.safety_radius
const CACHE_TERRAIN = require('../config.json').terrain.cache
const CACHE_DB_NAME = require('../config.json').terrain.cache_name
const VIEW_PADDING = require('../config.json').terrain.view_padding
const VIEW_HEIGHT = require('../config.json').terrain.view_height
const CHUNK_LOD_LEVELS = require('../config.json').terrain.lod

var observer = require('continuous-observer')
var heightmap = require('heightmap-mesher')
var frustum = require('box-frustum')

var createBuffer = require('gl-buffer')
var createVAO = require('gl-vao')
var mat4 = require('gl-matrix').mat4

var terrain = require('./terrain')
var generator = require('./terrain-generator')

var meshHeightmap = require('worker-query/parent')(
  require('webworkify')(require('./terrain-mesher'))
)

/**
 * Creates a continuous ndarray, which is exported.
 * This will handle storing the heightmap access and
 * modification for everything.
 */
var field = module.exports = require('ndarray-continuous')({
    shape: [CHUNK_SIZE, CHUNK_SIZE]
  , getter: generator
})

/**
 * continuous-observer will handle creating/removing
 * terrain chunks in response to camera movement.
 */
field.gl = null
field.render = render
field.meshes = []
field.moveTo = observer(field
  , CREATE_RADIUS
  , SAFETY_RADIUS
)

/**
 * Handles the addition/removal of terrain meshes
 * from the scene as new chunks are spawned.
 *
 * Note it's important that anything created
 * must also be cleaned up afterwards.
 */
field
  .on('created', createTerrain)
  .on('removed', removeTerrain)

var flagged = {}
function createTerrain(chunk) {
  var key = chunk.position.join(':')
  flagged[key] = false

  meshHeightmap({
      array: chunk.data
    , x: chunk.position[0]
    , y: chunk.position[1]
  }, function(err, data) {
    if (flagged[key]) return delete flagged[key]
    chunk.meshes = []
    chunk.mesh = 0
    var i = data.length
    while (i--) {
      ;(chunk.meshes[i] = meshify(
          data[i].positions
        , data[i].normals
      )).chunk = chunk
    }
  })
}

function removeTerrain(chunk) {
  if (!chunk.meshes) return flagged[chunk.position.join(':')] = true
  // var idx = this.meshes.indexOf(chunk.mesh)
  // if (idx !== -1) this.meshes.splice(idx, 1)
  for (var i = 0; i < chunk.meshes.length; i += 1) {
    chunk.meshes[i].vertices.dispose()
    delete chunk.meshes[i].chunk
  }
  chunk.meshes.length = 0
  delete chunk.meshes
}

/**
 * Store once-generated terrain in a IDB
 * database using level.js. This reduces
 * the cost of generation  to a consistent
 * value after "priming" the animation.
 */
if (!!CACHE_TERRAIN) {
  var storage = require('continuous-storage')
  var leveljs = require('level-js')
  var levelup = require('levelup')
  var db = levelup(CACHE_DB_NAME, {
    db: leveljs
  })

  field.storage = storage(db, field)
  field.on('created', function(chunk) {
    if (chunk.fresh) field.storage.save(chunk)
  })
}

function meshify(positions, normals) {
  var gl = field.gl

  var vertices = createVAO(gl, null, [{
    buffer: createBuffer(gl, positions)
    , type: gl.FLOAT
    , size: 3
  }, {
    buffer: createBuffer(gl, normals)
    , type: gl.FLOAT
    , size: 3
  }])

  return { vertices: vertices, length: positions.length / 3 }
}

var scratch = new Float32Array(16)
var scratchvec = new Float32Array(3)
var scratchview = new Float32Array(16)
var scratchaabb = [[0,0,0],[0,0,0]]

function render(shader, projection, view, position) {
  var meshes = this.meshes
  var i = this.meshes.length
  var gl = this.gl
  var latest

  mat4.multiply(scratchview, projection, view)
  scratchaabb[0][1] = -VIEW_HEIGHT
  scratchaabb[1][1] = +VIEW_HEIGHT
  scratchvec[1] = 0

  field.each(function(chunk) {
    var pos = chunk.position

    scratchvec[0] = pos[0]
    scratchvec[2] = pos[1]
    if (!chunk.meshes) return
    if (!VIEW_PADDING) {
      var mesh = chunk.meshes[0]
    } else {
      var dx = pos[0] - position[0]
      var dy = pos[1] - position[2]
      var d = dx*dx+dy*dy
      d = Math.abs(d/1)|0
      d = d > CHUNK_LOD_LEVELS ? CHUNK_LOD_LEVELS : d < 0 ? 0 : d
      var mesh = chunk.meshes[d]
      scratchaabb[0][0] = (scratchvec[0]) - VIEW_PADDING
      scratchaabb[0][2] = (scratchvec[2]) - VIEW_PADDING
      scratchaabb[1][0] = (scratchvec[0]) + VIEW_PADDING
      scratchaabb[1][2] = (scratchvec[2]) + VIEW_PADDING
    }

    if (!VIEW_PADDING || frustum(scratchview, scratchaabb)) {
      mat4.translate(scratch, mat4.identity(scratch), scratchvec)
      shader.uniforms.uModel = scratch
      latest = mesh.vertices
      latest.bind()
      gl.drawArrays(gl.TRIANGLES, 0, mesh.length)
    }
  })

  if (latest) latest.unbind()
}
