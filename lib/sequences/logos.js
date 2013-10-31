/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const TWEAKABLE = require('../../config.json').tweakable
const LOOP = require('../../config.json').loop

var EventEmitter = require('events').EventEmitter
var duration = require('../duration')
var range = require('../timeline-range')
var tween = require('./tween-preset')
var tweenLUT = require('./tween-lut')
var logo = require('../logo')

var cubic    = require('./cubic')
var cubicIn  = require('./cubic')['in']
var cubicOut = require('./cubic')['out']

module.exports = function(shell, params, time) {
  return function(start, end) {
    var presets = {}
    var presetList = []
    var frame = duration(start, end)

    // Init (darkness, logos)
    if (!TWEAKABLE) {
      var logos = {
          wds: logo('img/logo-wds.png', 1052, 317, 0.5)
        , thomas: logo('img/credit-thomas.png', 800, 400, 0.5)
        , hugh: logo('img/credit-hugh.png', 800, 400, 0.5)
        , francois: logo('img/credit-francois.png', 800, 400, 0.5)
        , jack: logo('img/credit-jack.png', 800, 400, 0.5)
        , southim: logo('img/credit-south.png', 800, 400, 0.5)
      }
      params['lut 1'].value = 'harsh-spotlight'
      params['rgb shift'].value = 2
      params['fov'].value = 0.05
      params['egg brightness'].value = -1.5
      params['water level'].value = 14.75
    } else {
      var logos = {}
      return
    }

    function logoBetween(logo, a, b, c) {
      c = c || 1
      range(time.between(a, a + 1000), function(d) { logo.fade(d * c) })
      range(time.between(b - 1000, b), function(d) { logo.fade((1 - d) * c) })
    }

    // Scale out from darkness
    tween(params, time.between(0, 8000), { 'egg brightness': 0 })
    tween(params, time.between(9000, 20000), { 'rgb shift': 0 })
    tween(params, time.between(12000, 25000), {
        'fov': 0.25
      , 'egg brightness': 1.5
      , 'water level': 11.99
    })

    tweenLUT(params
      , time.between(14000, 20000)
      , 'spotlight'
    )


    // dawn
    var dawner = time.between(27000, 32000)
    tweenLUT(params, dawner, 'sunrise')
    tween(params, dawner, presets.sunrise = {
        'sky color': new Float32Array([0.525,0.6,0.75,1])
      , "directional color 1": new Float32Array([0.185,0.12,0.22])
      , 'directional color 2': new Float32Array([0,0,0.125])
      , 'directional dir 1': new Float32Array([1, 1, 1])
      , 'directional dir 2': new Float32Array([1,-0.2,0.8])
      , 'tree main color': new Float32Array([0.39, 1, 0.645])
      , 'tree stump color': new Float32Array([0.91,0.15,0.68])
    })

    // changing the camera angle to avoid
    // terrain clipping
    tween(params, time.between(28000, 30000), { 'camera angle': 0.1 })
    tween(params, time.between(32000, 34000), { 'camera angle': 0 })
    tween(params, time.between(54000, 56000), { 'camera angle': 0.1 })
    tween(params, time.between(65000, 68000), { 'camera angle': 0.3 })
    tween(params, time.between(75000, 78500), { 'camera angle': -0.2 })
    tween(params, time.between(88000, 90000), { 'camera angle': 0 })
    tween(params, time.between(160000, 163000), { 'camera angle': 0.35 })

    tween(params, time.between(56000, 60000), {
      'water level': 12.3
    })

    // forest
    var forester = time.between(60000, 65000)
    tweenLUT(params, forester, 'forest', cubic)
    tween(params, forester, presets.forest = {
        'camera distance': 1.8
      , 'fov': 0.145
      , 'water color': new Float32Array([0.72,1.03,1.12])
      , 'egg brightness': 1.935
      , 'egg color': new Float32Array([0.87,0.4,0.5])
      , 'sky color': new Float32Array([0.76,0.69,0.885,1])
      , 'directional color 1': new Float32Array([0.29,0.455,0.515])
      , 'directional color 2': new Float32Array([0.57,0.24,0.105])
      , 'directional dir 1': new Float32Array([1,0.69,-0.12])
      , 'directional dir 2': new Float32Array([0.47,0.3,1])
      , 'tree main color': new Float32Array([0.355,1,0.62])
      , 'tree stump color': new Float32Array([0.825,0.78,0.495])
    }, cubic)

    // dusk
    var dusker = time.between(90000, 95000)
    tweenLUT(params, dusker, 'dusk-2')
    tween(params, dusker, presets.dusk = {
        'camera distance': 0.835
      , 'fov':  0.3
      , 'rgb shift': 0.3
      , 'water level': 11.99
      , 'haze amount': 1
      , 'sky color': new Float32Array([0.895,0.67,0.58,1])
      , 'directional color 1': new Float32Array([0.455,0.275,0.175])
      , 'directional color 2': new Float32Array([0,0,0.125])
      , 'directional dir 1': new Float32Array([1,-0.2,0.8])
      , 'directional dir 2': new Float32Array([1,1,1])
      , 'egg color': new Float32Array([0.96,0.5,0.4])
      , 'tree main color': new Float32Array([0.98,0.85,0.67])
      , 'tree stump color': new Float32Array([1,1,1])
      , 'vignette': new Float32Array([-0.09,-0.11999999731779099,-0.11,1.034999966621399])
    })

    tween(params, time.between(114000, 119000), { 'water level': 12.45 }, cubic)
    tween(params, time.between(123000, 126000), { 'water level': 12.71 }, cubic)
    tween(params, time.between(148000, 152000), { 'water level': 12.20 }, cubic)

    tween(params, time.between(120000, 123000), { 'shark height': 0.125 })
    tween(params, time.between(166000, 168000), { 'shark height': 2 })

    var bubblegummer = time.between(114000, 118000)
    tweenLUT(params, bubblegummer, 'bubblegum')
    tween(params, bubblegummer, presets.bubblegum = {
        'water color': new Float32Array([1.12,0.9,1.82])
      , 'haze amount': 0
      , 'rgb shift': 0
      , 'egg brightness': 0.95
      , 'egg color': new Float32Array([0.775,0.415,1])
      , 'sky color': new Float32Array([0.81,0.74,1,1])
      , 'directional color 1': new Float32Array([0.715,0.385,0.68])
      , 'directional color 2': new Float32Array([0.73,0.52,0.685])
      , 'directional dir 1': new Float32Array([-1,1,1])
      , 'directional dir 2': new Float32Array([1,0.1,1])
      , 'tree main color': new Float32Array([0.56,1,0.56])
      , 'tree stump color': new Float32Array([0.57,0.995,0.835])
      , 'vignette': new Float32Array([-0.25,-0.25,-0.25,1.001])
    }, cubic)

    var citier = time.between(155000, 158200)
    tweenLUT(params, citier, 'city-2')
    tween(params, citier, presets.city = {
        'vignette': new Float32Array([-0.15,-0.12,-0.06,1.125])
      , 'water level': 12.7525
      , 'water color': new Float32Array([0.36,1.05,1.26])
      , 'egg brightness': 1.715
      , 'egg color': new Float32Array([0.485,0.654,1])
      , 'sky color': new Float32Array([0.135,0.28,0.395,1])
      , 'directional color 1': new Float32Array([0,0.185,0.445])
      , 'directional color 2': new Float32Array([0.385,0.195,0])
      , 'directional dir 1': new Float32Array([1,1,1])
      , 'directional dir 2': new Float32Array([-0.42,-0.32,1])
      , 'tree main color': new Float32Array([0.995,0.51,0.315])
      , 'tree stump color': new Float32Array([0.595,0.53,0.285])
    }, cubicOut)

    tween(params, time.between(164000, 170000), {
        'camera angle': -0.33
      , 'camera distance': 0.2715
      , 'fov': 0.52
    })

    var canyonify = time.between(187800, 192500)
    tweenLUT(params, canyonify, 'canyon')
    tween(params, canyonify, presets.canyon = {
        'camera angle': 0.15
      , 'camera distance': 1.7905
      , 'fov': 0.405
      , 'haze amount': 0.21
      , 'vignette': new Float32Array([-0.45,-0.435,-0.09,0.885])
      , 'water level': 12.85
      , 'water color': new Float32Array([0.86,1.04,1.32])
      , 'egg brightness': 1.995
      , 'egg color': new Float32Array([0.67,0.565,0.31])
      , 'sky color': new Float32Array([0.95,0.95,1,1])
      , 'directional color 1': new Float32Array([1,0.565,0.535])
      , 'directional color 2': new Float32Array([0.9,0.46,0])
      , 'directional dir 1': new Float32Array([0.12,0.71,0.04])
      , 'directional dir 2': new Float32Array([0.76,0.81,0.78])
      , 'tree main color': new Float32Array([0.92,0.56,1])
      , 'tree stump color': new Float32Array([0.8,0.91,1])
    })

    tween(params, time.between(185000, 186000), { 'camera spin': 0 })
    tween(params, time.between(188200, 198000), {
      'camera spin': Math.PI * 1.5
    }, cubic)

    var dur = 9800 / 3
    var a = 188200
    var b = a + dur
    var c = b + dur
    var d = c + dur

    tween(params, time.between(a, b), { 'camera angle': -0.45 }, cubic)
    tween(params, time.between(b, c), { 'camera angle': 0.4 }, cubic)
    tween(params, time.between(c, d), { 'camera angle': 0.15 }, cubic)

    tween(params, time.between(199600, 225000), {
        'sky color': new Float32Array([0,0,0,1])
      , 'directional color 1': new Float32Array([0,0,0])
      , 'directional color 2': new Float32Array([0,0,0])
      , 'water color': new Float32Array([0.08*0.75,1.09*0.75,1.43*0.75])
      , 'egg brightness': 1.2
    }).on('data', function(d) {
      shell.canvas.style.webkitFilter = 'blur('+(d*10)+'px)'
    })

    if (!TWEAKABLE) {
      logoBetween(logos.thomas, 208000, 211000, 0.9)
      logoBetween(logos.hugh, 211000, 214000, 0.9)
      logoBetween(logos.francois, 214000, 217000, 0.9)
      logoBetween(logos.jack, 217000, 220000, 0.9)
      range(time.between(220000, 223000), function(d) { logos.wds.fade(d) })
    }

    Object.keys(presets).forEach(function(key) {
      if (/canyon|bubblegum/.test(key)) return
      presetList.push(presets[key])
    })

    if (LOOP && TWEAKABLE) setTimeout(function() {
      window.location = window.location
    }, 200000)

    time.between(220000, 230000).once('start', function() {
      if (!!LOOP) setTimeout(function() {
        window.location = window.location
      }, 60000)

      setInterval(function() {
        var now = time.prevtime
        time.reset()
        var combo = presetList[~~(Math.random() * presetList.length)]
        combo['rgb shift'] = 0
        combo['haze amount'] = 0
        combo['camera angle'] = 0.15
        combo['haze amount'] = 0
        combo['camera angle'] = 0.15
        combo['camera distance'] = 1.7905
        combo['fov'] = 0.405
        combo['water level'] = 12.85
        tween(params, time.between(now, now + 5000), combo, cubic)
      }, 15000)
    })
  }
}
