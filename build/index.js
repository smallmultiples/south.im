//
// This file sets off the required build
// processes, and renders pregenerated heightmaps
// for the overall terrain to images. This theoretically
// gives us more control over the final result with less
// overhead - e.g. we could run an erosion simulation over
// the terrain - but we never got the time to implement
// it fully.
//

var perlin = require('perlin').noise.perlin2
var through = require('through')
var ndarray = require('ndarray')
var biomes = require('./biomes')
var grouped = require('ndarray-group')
var fill = require('ndarray-fill')
var save = require('save-pixels')
var rgb = require('rgb-pack')
var zeros = require('zeros')
var async = require('async')
var path = require('path')
var fs = require('fs')

var config = require('../config.json')

const LINE = '                                  \r'
const UNITS = config.generator.units
const CHUNK = config.generator.chunk
const ORIGIN = UNITS / 2
const UNIT_CHUNKS = UNITS / CHUNK
const CHUNK_COUNT = UNIT_CHUNKS * UNIT_CHUNKS
const LAYERS = 3

const OFFSET_X   = config.terrain.offset[0]
const OFFSET_Y   = config.terrain.offset[1]
const LARGE_WAVE = config.terrain.large.wave
const LARGE_AMP  = config.terrain.large.amp
const HUGE_WAVE  = config.terrain.huge.wave
const HUGE_AMP   = config.terrain.huge.amp
const MAIN_WAVE  = config.terrain.main.wave
const MAIN_AMP   = config.terrain.main.amp
const SMALL_WAVE = config.terrain.small.wave
const SMALL_AMP  = config.terrain.small.amp
const TINY_WAVE  = config.terrain.tiny.wave
const TINY_AMP   = config.terrain.tiny.amp

module.exports = generate

// Crop our color grading LUTs before
// proceeding with the heightmap generation.
require('./trim-grades')(function(err) {
  if (err) throw err
  generate()
})

function generate() {
  var arrays = []
  console.log('initializing ' + CHUNK_COUNT + ' chunks')
  process.stdout.write(LINE)
  for (var i = 0; i < UNIT_CHUNKS; i += 1)
  for (var j = 0; j < UNIT_CHUNKS; j += 1) {
    var ndarr = ndarray(new Float32Array(CHUNK*CHUNK*LAYERS), [CHUNK, CHUNK, LAYERS])
    ndarr.position = [j, i]
    arrays.push(ndarr)
    process.stdout.write('initialized chunk at ' + ndarr.position.join(',') + '      \r')
  }

  var group = grouped([UNIT_CHUNKS, UNIT_CHUNKS, 1], arrays)
  process.stdout.write(LINE)
  populate(group)

  store(group, __dirname + '/../dist/', function(err) {
    if (err) throw err
    console.log('grouped chunks! Shape: ' + group.shape.join(','))
  })
}

function populate(terrain) {
  console.log('generating terrain')
  process.stdout.write(LINE)
  var i = 0
  for (var x = 0; x < UNITS; x += 1)
  for (var y = 0; y < UNITS; y += 1) {
    var bvals = biomes(x-ORIGIN, y-ORIGIN)
    var count = bvals.length
    var value = 0
    for (var i = 0; i < count; i += 1) {
      if (bvals[i]) value += biomes[i](x-ORIGIN, y-ORIGIN) * bvals[i]
    }
    terrain.set(x, y, 0, value)
    if (!y) process.stdout.write('row '+x+'/'+UNITS+'        \r')
  }
  process.stdout.write(LINE)
}

function store(terrain, dest, done) {
  save(greymap(terrain.transpose(1, 0, 2)), 'png')
    .pipe(fs.createWriteStream(path.resolve(dest, 'terrain.png')))

  async.mapLimit(terrain.children, 10, function(chunk, done) {
    var name = 'terrain-chunk-' + chunk.position.map(prefix).join('x') + '.png'

    save(rgbmap(chunk), 'png')
      .pipe(fs.createWriteStream(path.resolve(dest, name)))
      .once('error', done)
      .once('close', function() {
        console.log(name)
        done()
      })
  }, function(err) {
    if (err) return next(err)
  })
}

function rgbmap(chunk) {
  var other = zeros([chunk.shape[0], chunk.shape[1]])
  fill(other, function(x, y) {
    return clamp((256*256*256*((chunk.get(x,y,0))))|0, 0, 256*256*256)
  })
  return rgb.pack(other)
}

function greymap(chunk) {
  var other = zeros([chunk.shape[0], chunk.shape[1], 4])
  fill(other, function(x, y, c) {
    if (c === 3) return 255
    return clamp((chunk.get(x, y, 0)*256*12)|0, 0, 255)
  })
  return other
}

function clamp(a, b, c) {
  return a < b ? b : a > c ? c : a
}

function prefix(n) {
  n = String(n)
  while (n.length < 3) n = '0' + n
  return n
}
