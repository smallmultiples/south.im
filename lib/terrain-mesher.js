var perlin = require('perlin').noise.perlin2
var biomes = require('../build/biomes')
var downsample = require('ndarray-downsample2x')
var heightmap = require('heightmap-mesher')
var normalify = require('mesh-normals')
var terrain = require('./terrain')
var ndarray = require('ndarray')
var zeros = require('zeros')

const CHUNK_LOD_LEVELS = require('../config.json').terrain.lod
const CHUNK_SIZE = require('../config.json').terrain.chunk_size
const WOBBLE = (
  require('../config.json').terrain.wobble /
  require('../config.json').terrain.chunk_size
)

module.exports = require('worker-query/child')(function(data, callback) {
  var xoff = data.x * (CHUNK_SIZE - 1)
  var yoff = data.y * (CHUNK_SIZE - 1)
  var array = ndarray(data.array, [CHUNK_SIZE, CHUNK_SIZE])
  var map = heightmap(array)
  var normals = normalify(map)
  var transfer = [normals.buffer, map.buffer]

  if (!!WOBBLE)
  for (var i = 0; i < map.length; i += 1) {
    map[i] += perlin(47.3298, 389.0239 + map[i] * 87.324) * WOBBLE
  }

  var lastmip = array
  var maps = [{positions:map,normals:normals}]

  if (!!CHUNK_LOD_LEVELS)
  for (var i = 1; i <= CHUNK_LOD_LEVELS; i += 1) {
    var size = CHUNK_SIZE >> i
    var mip = zeros([size, size])
    downsample(mip, lastmip)

    for (var x = 0; x < size; x++)
    for (var y = 0; y < size; y++) {
      if (x && y && x+1 !== size && y+1 !== size) continue
      var c = i
      var _x = Math.round(i/2)*2
      var _y = Math.round(i/2)*2
      mip.data[x*size+y] = (terrain((x<<c)+(1<<c)*(x?0.5:-0.5)+xoff, (y<<c)+(1<<c)*(y?0.5:-0.5)+yoff))
    }

    var mesh = heightmap(mip)
    var mnorm = normalify(mesh)
    maps[i] = {positions:mesh,normals:mnorm}
    transfer.push(mesh.buffer, mnorm.buffer)
    lastmip = mip
  }

  callback(null, maps, transfer)
})
