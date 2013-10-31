//
// Responsible for generating indivdual heightmap chunks.
// This is passed onto the ndarray-continuous instance
// in `lib/terrain-manager.js`.
//
var terrain = require('./terrain')
var zeros = require('zeros')
var cwise = require('cwise')

const CHUNK_SIZE = require('../config.json').terrain.chunk_size
const dims = [CHUNK_SIZE, CHUNK_SIZE]

var fill = cwise({
    args: ['array', 'index', 'scalar', 'scalar', 'scalar']
  , funcName: 'cwiseTerrainFill'
  , body: function(height, position, x, y, terrain) {
    height = terrain(position[0]+x, position[1]+y)
  }
})

module.exports = getter
function getter(pos, next) {
  var array = zeros(dims)
  var x = pos[0] * (CHUNK_SIZE - 1)
  var y = pos[1] * (CHUNK_SIZE - 1)

  fill(array, x, y, terrain)
  array.fresh = true

  return next(null, array)
}
