var perlin = require('perlin').noise.perlin2
var normalize = require('vectors/normalize')(3)
var cross = require('vectors/cross')(3)
var sub = require('vectors/sub')(3)
var biomes = require('../build/biomes')
var shell
var sampler

const SIDE_INCREMENT = 1
const ORIGIN = (
  require('../config.json').generator.units / 2 /
  require('../config.json').terrain.chunk_size *
  require('../config.json').generator.scale
)


if (process.browser && typeof window !== 'undefined') process.nextTick(function() {
  shell = require('./shell')
})

// These files are loaded in from config.json as constants,
// which are then inlined directly.
const OFFSET_X = require('../config.json').terrain.offset[0]
const OFFSET_Y = require('../config.json').terrain.offset[1]
const LARGE_WAVE = require('../config.json').terrain.large.wave
const LARGE_AMP = require('../config.json').terrain.large.amp
const HUGE_WAVE = require('../config.json').terrain.huge.wave
const HUGE_AMP = require('../config.json').terrain.huge.amp
const MAIN_WAVE = require('../config.json').terrain.main.wave
const MAIN_AMP = require('../config.json').terrain.main.amp
const SMALL_WAVE = require('../config.json').terrain.small.wave
const SMALL_AMP = require('../config.json').terrain.small.amp
const TINY_WAVE = require('../config.json').terrain.tiny.wave
const TINY_AMP = require('../config.json').terrain.tiny.amp

const SAMPLER_AMP = require('../config.json').terrain.sampler.amp
const SAMPLER_WAVE = require('../config.json').terrain.sampler.wave

const CHUNK_SIZE = require('../config.json').terrain.chunk_size
const MAP_SIZE = require('../config.json').generator.chunk
const SCALE = require('../config.json').generator.scale
const DNR = 256*256

var ccc = 0

module.exports = terrain

var sample = require('bicubic-sample')(function pixel(x, y) {
  var X = +(x / MAP_SIZE)|0
  var Y = +(y / MAP_SIZE)|0
  var chunk = shell.chunkCache[X]
  return !chunk || !chunk[Y] || x < 0 || y < 0 ? 0 : (
    chunk[Y].get((x%MAP_SIZE)|0, (y%MAP_SIZE)|0) / DNR
  )
})

function terrain(x, y) {
  var value = sample(x / SCALE, y / SCALE)
  var _x = (x/12-ORIGIN*4)
  var _y = (y/12-ORIGIN*4)
  var bio = biomes(_x, _y)

  var roughness = 0
  for (var i = 0; i < bio.length; i += 1) {
    roughness += biomes[i].roughness * bio[i]
  }

  return roughness ? ( value + roughness * (
    + perlin(0.54510 * x, 0.54510 * y) * 0.0125
    + perlin(0.03579 * x, 0.03579 * y) * 0.135
    + perlin(0.01579 * x, 0.01579 * y) * 0.21
    - perlin(0.06579 * x, 0.06579 * y) * 0.04
    + perlin(0.13284 * x, 0.13892 * y) * 0.03
    + perlin(0.00579 * x, 0.00579 * y) * 0.15
  )) : value
}

terrain.biome = biome
function biome(x, y) {
  return biomes((x-ORIGIN)*4, (y-ORIGIN)*4)
}

var t = [0,0,0]
var b = [0,0,0]
var r = [0,0,0]
var l = [0,0,0]

terrain.normal = normal
function normal(x, y, side) {
  if (!side) side = 0.15

  t[0] = x
  t[1] = terrain(x*CHUNK_SIZE, (y-side)*CHUNK_SIZE)
  t[2] = y-side

  b[0] = x
  b[1] = terrain(x*CHUNK_SIZE, (y+side)*CHUNK_SIZE)
  b[2] = y+side

  r[0] = x+side
  r[1] = terrain((x+side)*CHUNK_SIZE, y*CHUNK_SIZE),
  r[2] = y

  l[0] = x-side
  l[1] = terrain((x-side)*CHUNK_SIZE, y*CHUNK_SIZE)
  l[2] = y

  sub(t, b)
  sub(l, r)

  return normalize(cross(t, l))
}
