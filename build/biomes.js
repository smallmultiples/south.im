var perlin = require('perlin').noise.perlin2
var clamp = require('clamp')

var typeCount = biomes.length = 9

const TYPE_NORMAL = 0
const TYPE_SIDEINTRO = 1
const TYPE_INTRO = 2
const TYPE_BUBBLEGUM = 3
const TYPE_CITY = 4
const TYPE_CANYON = 5
const TYPE_FOREST = 6
const TYPE_DESERT = 7
const TYPE_PLATEAU = 8

module.exports = biomes

var points = biomes.points = [{
  x: 0, z: 0, r: 40, type: +TYPE_INTRO|0
}, {
  x: 0, z: 40, r: 25, type: +TYPE_SIDEINTRO|0
}, {
  x: 0, z: 278, r: 40, type: +TYPE_BUBBLEGUM|0
}, {
  x: 0, z: 360, r: 30.5, type: +TYPE_CITY|0
},  {
  x: 0, z: 355, r: 30.5, type: +TYPE_CITY|0
}, {
  x: 0, z: 428, r: 38, type: +TYPE_CANYON|0
}, {
  x: 0, z: 146, r: 36, type: +TYPE_FOREST|0
}, {
  x: 0, z: 210, r: 37, type: +TYPE_DESERT|0
}, {
  x: 0, z: 210, r: 37, type: +TYPE_DESERT|0
}, {
  x: -7.65, z: 400, r: 3.5, type: +TYPE_PLATEAU|0
}]

var pointCount = points.length
var scratch = new Float32Array(typeCount)

function biomes(x, z) {
  for (var i = 0; i < typeCount; i += 1) {
    scratch[i] = 0
  }

  scratch[TYPE_NORMAL] = 0.25

  // Circular "biomes", though they're not really
  // biomes. The terrain isn't infinite but predetermined,
  // so it's OK not to use Worley noise or something
  // similar.
  for (var i = 0; i < pointCount; i += 1) {
    var pt = points[i]
    var dx = (pt.x - x)
    var dz = (pt.z - z)
    var d = Math.sqrt(dx*dx+dz*dz)
    var type = pt.type || TYPE_NORMAL
    var val = clamp(1 - (d) / (pt.r), 0, 1)
    scratch[type] += val
  }

  // Normalize
  var total = 0
  for (var i = 0; i < typeCount; i += 1) {
    total += scratch[i]
  }
  for (var i = 0; i < typeCount; i += 1) {
    scratch[i] /= total
  }

  return scratch
}

const LARGE_WAVE = require('../config.json').terrain.large.wave
const LARGE_AMP  = require('../config.json').terrain.large.amp
const HUGE_WAVE  = require('../config.json').terrain.huge.wave
const HUGE_AMP   = require('../config.json').terrain.huge.amp
const MAIN_WAVE  = require('../config.json').terrain.main.wave
const MAIN_AMP   = require('../config.json').terrain.main.amp
const SMALL_WAVE = require('../config.json').terrain.small.wave
const SMALL_AMP  = require('../config.json').terrain.small.amp
const TINY_WAVE  = require('../config.json').terrain.tiny.wave
const TINY_AMP   = require('../config.json').terrain.tiny.amp

const DESERT_WAVE = 0.1
const DESERT_AMP = 1

//
// The standard terrain to use when there aren't any
// biomes overriding the current one.
//
biomes[TYPE_NORMAL] = function normal(x, y) {
  var dx = x
  var dy = y
  var d = Math.sqrt(dx*dx+dy*dy)
  return ((
    + (perlin(HUGE_WAVE * x, HUGE_WAVE * y) * HUGE_AMP)
    + (perlin(LARGE_WAVE * x, LARGE_WAVE * y) * LARGE_AMP)
    + (perlin(SMALL_WAVE * x, SMALL_WAVE * y) * SMALL_AMP)
    + (perlin(TINY_WAVE  * x, TINY_WAVE  * y) * TINY_AMP)
    + (perlin(MAIN_WAVE  * x, MAIN_WAVE  * y) * MAIN_AMP)
  ) + 10) / 200
}

biomes[TYPE_NORMAL].foliage = 'trees'
biomes[TYPE_NORMAL].density = 2
biomes[TYPE_NORMAL].roughness = 1

//
// Slightly higher and bumpier terrain around
// the origin at the very beginning, so that the
// egg can descend down into the first scene.
//
biomes[TYPE_SIDEINTRO] = function desert(x, y) {
  var dx = x
  var dy = y
  var d = Math.sqrt(dx*dx+dy*dy)
  return ((
    + (perlin(DESERT_WAVE * x, DESERT_WAVE * y) * DESERT_AMP)
    + (perlin(HUGE_WAVE * x, HUGE_WAVE * y) * HUGE_AMP * 2)
    + (perlin(LARGE_WAVE * x, LARGE_WAVE * y) * LARGE_AMP)
    + (perlin(MAIN_WAVE  * x, MAIN_WAVE  * y) * MAIN_AMP)
  ) + 10) / 200
}

biomes[TYPE_SIDEINTRO].foliage = 'trees'
biomes[TYPE_SIDEINTRO].density = 1
biomes[TYPE_SIDEINTRO].roughness = 1.1

biomes[TYPE_INTRO] = function city(x, y) {
  var dx = x
  var dy = y
  var d = Math.sqrt(dx*dx+dy*dy)
  return ((
    + (perlin(DESERT_WAVE/2 * x, DESERT_WAVE/2 * y) * DESERT_AMP)
    + (perlin(HUGE_WAVE/2 * x, HUGE_WAVE/2 * y) * HUGE_AMP)
    + (perlin(LARGE_WAVE/2 * x, LARGE_WAVE/2 * y) * LARGE_AMP)
    + (perlin(MAIN_WAVE/2  * x, MAIN_WAVE  * y) * MAIN_AMP)
  ) + 10) / 150
}

biomes[TYPE_INTRO].foliage = 'trees'
biomes[TYPE_INTRO].density = 1
biomes[TYPE_INTRO].roughness = 1.25

//
// A little flatter and less sharp then
// the standard terrain for "bubblegum",
// the pinkish scene between the desert
// and the city.
//
biomes[TYPE_BUBBLEGUM] = function normal(x, y) {
  var dx = x
  var dy = y
  var d = Math.sqrt(dx*dx+dy*dy)
  return ((
    + (perlin(HUGE_WAVE * x, HUGE_WAVE * y) * HUGE_AMP)
    + (perlin(LARGE_WAVE * x, LARGE_WAVE * y) * LARGE_AMP)
    + (perlin(SMALL_WAVE * x, SMALL_WAVE * y) * SMALL_AMP)
    + (perlin(TINY_WAVE  * x, TINY_WAVE  * y) * TINY_AMP)
    + (perlin(MAIN_WAVE  * x, MAIN_WAVE  * y) * MAIN_AMP)
  ) * 0.7 + 10) / 200
}

biomes[TYPE_BUBBLEGUM].foliage = 'trees'
biomes[TYPE_BUBBLEGUM].density = 4
biomes[TYPE_BUBBLEGUM].roughness = 0.05

//
// Mostly flat terrain for the city
//
biomes[TYPE_CITY] = function normal(x, y) {
  var dx = x
  var dy = y
  var d = Math.sqrt(dx*dx+dy*dy)
  return ((
    + (perlin(HUGE_WAVE * x, HUGE_WAVE * y) * HUGE_AMP)
    + (perlin(LARGE_WAVE * x, LARGE_WAVE * y) * LARGE_AMP)
    + (perlin(SMALL_WAVE * x * 0.5, SMALL_WAVE * y * 0.5) * SMALL_AMP)
    + (perlin(TINY_WAVE  * x, TINY_WAVE  * y) * TINY_AMP)
    + (perlin(MAIN_WAVE  * x, MAIN_WAVE  * y) * MAIN_AMP * 1.2)
  ) * 0.2 + 10) / 200
}

biomes[TYPE_CITY].foliage = 'buildings'
biomes[TYPE_CITY].density = 1.8
biomes[TYPE_CITY].safezone = 0.7
biomes[TYPE_CITY].roughness = 0.8


//
// Forms the terrain for the mountain at the end
// of the animation.
//
biomes[TYPE_CANYON] = function normal(x, y) {
  var dx = x
  var dy = y
  var d = Math.sqrt(dx*dx+dy*dy)
  return ((
    + (perlin(HUGE_WAVE * x, HUGE_WAVE * y) * HUGE_AMP)
    + (perlin(LARGE_WAVE * x, LARGE_WAVE * y) * LARGE_AMP)
    + (perlin(SMALL_WAVE * x * 0.5, SMALL_WAVE * y * 0.5) * SMALL_AMP)
    + (perlin(TINY_WAVE  * x, TINY_WAVE  * y) * TINY_AMP)
    + (perlin(MAIN_WAVE  * x, MAIN_WAVE  * y) * MAIN_AMP * 1.2)
  ) * 1.05 + 10.55) / 200
}

biomes[TYPE_CANYON].foliage = 'trees'
biomes[TYPE_CANYON].density = 1.2
biomes[TYPE_CANYON].roughness = 3.05

//
// Equivalent to the normal type of terrain,
// but with a much higher "density" value which
// results in a lot more trees in this scene.
//
biomes[TYPE_FOREST] = function normal(x, y) {
  var dx = x
  var dy = y
  var d = Math.sqrt(dx*dx+dy*dy)
  return ((
    + (perlin(HUGE_WAVE * x, HUGE_WAVE * y) * HUGE_AMP)
    + (perlin(LARGE_WAVE * x, LARGE_WAVE * y) * LARGE_AMP)
    + (perlin(SMALL_WAVE * x, SMALL_WAVE * y) * SMALL_AMP)
    + (perlin(TINY_WAVE  * x, TINY_WAVE  * y) * TINY_AMP)
    + (perlin(MAIN_WAVE  * x, MAIN_WAVE  * y) * MAIN_AMP * 1.2)
  ) + 10) / 200
}

biomes[TYPE_FOREST].foliage = 'trees'
biomes[TYPE_FOREST].density = 10
biomes[TYPE_FOREST].roughness = 1.225

//
// The desert/dusk biome plants cacti amongst
// the trees, and is a little more sparse/flat
// then the standard terrain.
//
biomes[TYPE_DESERT] = function normal(x, y) {
  var dx = x
  var dy = y
  var d = Math.sqrt(dx*dx+dy*dy)
  return ((
    + (perlin(HUGE_WAVE * x, HUGE_WAVE * y) * HUGE_AMP)
    + (perlin(LARGE_WAVE * x, LARGE_WAVE * y) * LARGE_AMP)
    + (perlin(SMALL_WAVE * x, SMALL_WAVE * y) * SMALL_AMP)
    + (perlin(TINY_WAVE  * x, TINY_WAVE  * y) * TINY_AMP)
    + (perlin(MAIN_WAVE  * x, MAIN_WAVE  * y) * MAIN_AMP * 1.2)
  ) + 10) / 200
}

biomes[TYPE_DESERT].foliage = 'cacti'
biomes[TYPE_DESERT].density = 0.8
biomes[TYPE_DESERT].roughness = 0.8

//
// Used to flatten out the terrain at the tip
// of the mountain at the end of the animation,
// so we can place "WDS13" and make it more
// readable.
//
biomes[TYPE_PLATEAU] = function normal(x, y) {
  return 10.75 / 200
}

biomes[TYPE_PLATEAU].foliage = 'cacti'
biomes[TYPE_PLATEAU].density = 0.0
biomes[TYPE_PLATEAU].roughness = 0.0
