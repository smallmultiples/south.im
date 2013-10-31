/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const MINIMAP = require('./config.json').minimap
const TIMELINE = require('./config.json').timeline
const CACHE_CHUNKS = require('./config.json').terrain.cache
const ORIGIN = require('./config.json').generator.units / 2
const UNITS = require('./config.json').generator.units
const UNIT_CHUNKS = (
  require('./config.json').generator.units /
  require('./config.json').generator.chunk
)

var createBadge = require('soundcloud-badge')
var grades = require('./dist/luts.json')
var analyser = require('web-audio-analyser')
var getPixels = require('get-pixels')
var loaded = require('image-loaded')
var s = require('./lib/space')
var rgb = require('rgb-pack')
var once = require('once')
var images = []
var shell

for (var x = 0; x < UNIT_CHUNKS; x += 1)
for (var y = 0; y < UNIT_CHUNKS; y += 1) {
  images.push({
      x: x
    , y: y
    , src: 'dist/terrain-chunk-'+prefix(x)+'x'+prefix(y)+'.png'
  })
}

var gradeImages = {}
require('map-async')(grades, function(url, name, next) {
  getPixels(url, function(err, data) {
    if (err) return next(err)
    gradeImages[name] = data.step(-1, 1, 1)
    next()
  })
}, function(err) {
  if (err) throw err
  prepareMinimap()
})

var terrain_chunks = []
var MINI_SIZE = 250
var minimap = document.createElement('img')
var miniwrap = document.createElement('div')
var minihere = document.createElement('div')

function prepareMinimap() {
  miniwrap.style.border = '1px solid #fff'

  minihere.style.background = '#f00'
  minihere.style.width =
  minihere.style.height = '4px'
  minihere.style.position = 'absolute'
  minihere.style.top =
  minihere.style.left = (MINI_SIZE/2-2) + 'px'

  if (!!MINIMAP) {
    minimapLoaded()
  } else {
    loaded(minimap, minimapLoaded)
    minimap.src = 'dist/terrain.png'
  }
}

function minimapLoaded() {
  miniwrap.style.position = 'absolute'
  miniwrap.style.zIndex = 9
  miniwrap.style.bottom = TIMELINE ? '50px' : '20px'
  miniwrap.style.left = '20px'
  miniwrap.style.width = MINI_SIZE + 'px'
  miniwrap.style.height = MINI_SIZE + 'px'
  miniwrap.style.overflow = 'hidden'

  minimap.style.position = 'absolute'
  minimap.style.top = 0
  minimap.style.left = 0

  updateMinimap(ORIGIN, ORIGIN)
  function updateMinimap(x, y) {
    minimap.style.left = (MINI_SIZE/2-x) + 'px'
    minimap.style.top = (MINI_SIZE/2-y) + 'px'
  }

  miniwrap.appendChild(minimap)
  miniwrap.appendChild(minihere)
  if (!!MINIMAP) document.body.appendChild(miniwrap)

  require('map-async')(images, function(chunk, i, next) {
    setTimeout(function() {
      getPixels(chunk.src, function(err, data) {
        if (err) return next(err)
        console.log('downloaded heightmap: ' + chunk.src)
        terrain_chunks[chunk.x] = terrain_chunks[chunk.x] || []
        terrain_chunks[chunk.x][chunk.y] = rgb.unpack(data)
        next()
      })
    }, 10 * i)
  }, function(err) {
    if (err) throw err

    createBadge({
        song: 'https://soundcloud.com/thomasbarrandon/clones'
      , client_id: 'ded451c6d8f9ff1c62f72523f49dab68'
      , dark: false
      , getFonts: true
    }, gotSong)

    function gotSong(err, src, data, div) {
      if (err) throw err
      var audio = new Audio
      var ready = once(startup)

      if (div) {
        console.log('got song metadata.')
        div.style.display = 'none'
      }

      audio.addEventListener('canplay', ready)
      audio.addEventListener('ended', ended)
      setTimeout(ready, 5000)
      audio.src = src

      function startup(e) {
        console.log('starting!')
        shell = window.shell = require('./lib/shell')
        shell.song = audio
        shell.amplitude = 0
        shell.waveform = new Uint8Array(1024)
        shell.frequencies = new Uint8Array(512)
        shell.audio = analyser(audio)
        shell.chunkCache = terrain_chunks
        shell.minimap = updateMinimap
        shell.grades = gradeImages
      }

      function ended() {
        shell.finished()
      }
    }
  })
}

function prefix(n) {
  n = String(n)
  while (n.length < 3) n = '0' + n
  return n
}
