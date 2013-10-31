var createShader = require('gl-shader')
var gldefines = require('glsl-defines')
var defines = ''
+ gldefines(require('../config.json').defines_list)
+ gldefines(require('../config.json').defines_values)

module.exports = initShaders

function initShaders(gl) {
  var vert = gldefines(['VERTEX_SHADER'])   + defines
  var frag = gldefines(['FRAGMENT_SHADER']) + defines
  var shaders = {}

  shaders.terrain = createShader(gl
    , vert + require('../shaders/terrain.vert')
    , frag + require('../shaders/terrain.frag')
  )

  shaders.water = createShader(gl
    , vert + require('../shaders/water.vert')
    , frag + require('../shaders/water.frag')
  )

  shaders.tree = createShader(gl
    , vert + require('../shaders/tree.vert')
    , frag + require('../shaders/tree.frag')
  )

  shaders.speaker = createShader(gl
    , vert + require('../shaders/speaker.vert')
    , frag + require('../shaders/speaker.frag')
  )

  shaders.egg = createShader(gl
    , vert + require('../shaders/egg.vert')
    , frag + require('../shaders/egg.frag')
  )

  shaders.shark = createShader(gl
    , vert + require('../shaders/shark.vert')
    , frag + require('../shaders/shark.frag')
  )

  return shaders
}
