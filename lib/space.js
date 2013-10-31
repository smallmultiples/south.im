const ORIGIN = require('../config.json').generator.units / 2
const CHUNK_SIZE = require('../config.json').terrain.chunk_size
const SCALE = require('../config.json').generator.scale
const MAP_SIZE = (
  require('../config.json').generator.chunk
)
const CHUNKOVERMAP = (
  require('../config.json').terrain.chunk_size /
  require('../config.json').generator.chunk
)

// For converting between various unit sizes.
//
// * chunk: the terrain mesh chunks.
// * poly: individual cells in the live heightmap.
// * map: pixels in the pregenerated heightmap image.
//
// Added too late in the project - should've been
// added in the beginning, and it would've been used
// more and made for much more legible code.

exports.chunk = {
    poly: function(x) { return x * CHUNK_SIZE }
  , map: function(x) { return x * SCALE }
}

exports.poly = {
    chunk: function(x) { return x / CHUNK_SIZE }
  , map: function(x) { return x / MAP_SIZE }
}

exports.map = {
    chunk: function(x) { return x / SCALE }
  , poly: function(x) { return x * MAP_SIZE }
}
