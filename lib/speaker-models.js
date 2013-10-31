/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var camera = require('./camera-position')

const ORIGIN = (
  require('../config.json').generator.units / 2 /
  require('../config.json').terrain.chunk_size *
  require('../config.json').generator.scale
)

window.camera = camera

module.exports = [{
    model: require('../models/speakers/anna-gerber.obj')
  , z: 16, x: 0.3
  , tminus: 0.15
  , flip: true
  , rz: true
  , rotate: Math.PI*0.75
}, {
    model: require('../models/speakers/adam-ahmed.obj')
  , z: camera(35000) - ORIGIN, x: 0
  , flip: true
  , rx: true
  , rotate: Math.PI * 1.1
}, {
    model: require('../models/speakers/aarron-walter.obj')
  , z: camera(40000) - ORIGIN, x: 0
  , flip: true
  , tminus: 0.35
  , rotate: Math.PI * 0.9
}, {
    model: require('../models/speakers/andrew-betts.obj')
  , z: 24.5, x: -0.3
  , flip: true
  , rz: true
  , tminus: -0.05
  , rotate: Math.PI
}, {
    model: require('../models/speakers/axel-rauschmayer.obj')
  , z: camera(50500) - ORIGIN, x: -0.3
  , flip: true
  , tminus: 0.35
  , rotate: Math.PI * 1.35
}, {
    model: require('../models/speakers/david-demaree.obj')
  , z: camera(55000) - ORIGIN, x: -0.25
  , flip: true
  , tminus: -0.001
  , rotate: Math.PI * 1.2
}, {
    model: require('../models/speakers/relly-annett-baker.obj')
  , z: camera(61500) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , rotate: Math.PI * 1.55
}, {
    model: require('../models/speakers/glen-maddern.obj')
  , z: camera(65000) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , rotate: Math.PI * 1.75
  , scale: [1.3, 1.3, 1.3]
}, {
    model: require('../models/speakers/michael-neale.obj')
  , z: camera(75000) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , rotate: Math.PI * 1.55
}, {
    model: require('../models/speakers/simon-elvery.obj')
  , z: camera(78000) - ORIGIN, x: 0.05
  , flip: true
  , tminus: 0.15
  , rotate: 0
}, {
    model: require('../models/speakers/fiona-chan.obj')
  , z: camera(85000) - ORIGIN, x: 0.3
  , flip: true
  , tminus: 0.15
  , rotate: Math.PI * 0.2
}, {
    model: require('../models/speakers/ryan-seddon.obj')
  , z: camera(88000) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.2
  , rotate: Math.PI * -0.1
}, {
    model: require('../models/speakers/maciej-ceglowski.obj')
  , z: camera(98500) - ORIGIN, x: 0.25
  , flip: true
  , tminus: 0.15
  , scale: [1.4, 1.4, 1.4]
  , rotate: Math.PI * 0.5
}, {
    model: require('../models/speakers/karl-fast.obj')
  , z: camera(100000) - ORIGIN, x: -0.15
  , flip: true
  , tminus: -0.05
  , scale: [1.5, 1.5, 1.5]
  , rotate: Math.PI * 0.5
}, {
    model: require('../models/speakers/rachel-binx.obj')
  , z: camera(105000) - ORIGIN, x: -0.05
  , flip: true
  , tminus: 0.15
  , scale: [1.5, 1.5, 1.5]
  , rotate: Math.PI * 0.6
}, {
    model: require('../models/speakers/jared-wyles.obj')
  , z: camera(110000) - ORIGIN, x: 0.05
  , flip: true
  , tminus: 0.15
  , scale: [1.5, 1.5, 1.5]
  , rotate: Math.PI * 0.55
}, {
    model: require('../models/speakers/chris-lienert.obj')
  , z: camera(114500) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , rotate: Math.PI * 0.65
}, {
    model: require('../models/speakers/john-allsopp.obj')
  , z: camera(120000) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , scale: [1.25, 1.25, 1.25]
  , rotate: Math.PI * 1.25
}, {
    model: require('../models/speakers/dhanji-prassana.obj')
  , z: camera(125000) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , rotate: Math.PI * 1.05
}, {
    model: require('../models/speakers/scott-jenson.obj')
  , z: camera(135000) - ORIGIN, x: 0.05
  , flip: true
  , tminus: -0.05
  , scale: [1.2, 1.2, 1.2]
  , rotate: Math.PI * 1.15
}, {
    model: require('../models/speakers/alexandra-deschamps-sonsino.obj')
  , z: camera(140000) - ORIGIN, x: 0.05
  , flip: true
  , tminus: -0.05
  , scale: [0.8,0.8,0.8]
  , rotate: Math.PI * 1.45
}, {
    model: require('../models/speakers/golden-krishna.obj')
  , z: camera(145000) - ORIGIN, x: 0.05
  , flip: true
  , tminus: 0.15
  , scale: [1.6,1.6,1.6]
  , rotate: Math.PI * 1.55
}, {
    model: require('../models/speakers/rod-farmer.obj')
  , z: camera(149600) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , scale: [1.2, 1.2, 1.2]
  , rotate: Math.PI * 1.55
}, {
    model: require('../models/speakers/mark-dalgeish.obj')
  , z: camera(155000) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , rotate: Math.PI * 1.55
}, {
    model: require('../models/speakers/troy-hunt.obj')
  , z: camera(160000) - ORIGIN, x: -0.25
  , flip: true
  , tminus: 0.15
  , scale: [1.5, 1.5, 1.5]
  , rotate: Math.PI * 1.55
}, {
    model: require('../models/speakers/pasquale-d-silva.obj')
  , z: camera(164500) - ORIGIN, x: 0.025
  , flip: true
  , tminus: 0.15
  , rotate: 0
}, {
    model: require('../models/speakers/heather-gold.obj')
  , z: camera(170000) - ORIGIN, x: -0.15
  , flip: true
  , tminus: 0.15
  , rotate: Math.PI * 1.95
}, {
    model: require('../models/speakers/patrick-catanzariti.obj')
  , z: camera(185450) - ORIGIN, x: 0.25
  , flip: true
  , tminus: 0.15
  , scale: [1.25, 1.25, 1.25]
  , rotate: Math.PI * -1.5
}, {
    model: require('../models/wds13.obj')
  , z: camera(191648) - ORIGIN, x: 0.9
  , flip: true
  , tminus: 0.15
  , scale: [1.1, 1.1, 1.1]
  , rotate: Math.PI * 0.435 // 0.6
  , ignore: true
  , sink: 0.05
}]
