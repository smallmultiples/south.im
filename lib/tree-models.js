/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var models = module.exports = {}

models.trees = [{
  model: require('../models/trees/tree.obj')
  , dynamic: false
  , scale: 0.05
  , stump: 6
}, {
  model: require('../models/trees/tree1.obj')
  , dynamic: false
  , scale: 0.05
  , stump: 0
}, {
  model: require('../models/trees/tree2.obj')
  , dynamic: false
  , scale: 0.05
  , stump: 0
}, {
  model: require('../models/trees/tree3.obj')
  , dynamic: false
  , scale: 0.05
  , stump: 0
}, {
  model: require('../models/trees/tree4.obj')
  , dynamic: false
  , scale: 0.05
  , stump: 0
}, {
  model: require('../models/trees/tree18.obj')
  , dynamic: false
  , scale: 0.035
  , stump: 1
}, {
  model: require('../models/trees/tree13.obj')
  , dynamic: false
  , scale: 0.05
  , stump: 2
}, {
  model: require('../models/trees/tree5.obj')
  , dynamic: false
  , scale: 0.05
  , stump: 0
}]

models.buildings = [{
  model: require('../models/buildings/building1.obj')
  , dynamic: false
  , scale: 0.39
  , sink: 0.175
  , stump: 0
}, {
  model: require('../models/buildings/building3.obj')
  , dynamic: false
  , scale: 0.39
  , sink: 0.175
  , stump: 0
}, {
  model: require('../models/buildings/building4.obj')
  , dynamic: false
  , scale: 0.39
  , sink: 0.175
  , stump: 0
}, {
  model: require('../models/buildings/building5.obj')
  , dynamic: false
  , scale: 0.035
  , stump: 0
}, {
  model: require('../models/buildings/building12.obj')
  , dynamic: false
  , scale: 0.39
  , sink: 0.175
  , stump: 0
}, {
  model: require('../models/buildings/building7.obj')
  , dynamic: false
  , scale: 0.39
  , sink: 0.175
  , stump: 0
}, {
  model: require('../models/buildings/building8.obj')
  , dynamic: false
  , scale: 0.39
  , sink: 0.175
  , stump: 0
}, {
  model: require('../models/buildings/building9.obj')
  , dynamic: false
  , scale: 0.39
  , sink: 0.175
  , stump: 0
}, {
  model: require('../models/buildings/building10.obj')
  , dynamic: false
  , scale: 0.39
  , sink: 0.175
  , stump: 0
}]

models.cacti = [{
  model: require('../models/rocks-bushes/rock1.obj')
  , dynamic: false
  , scale: 0.05
  , stump: 0
}, {
  model: require('../models/trees/tree2.obj')
  , dynamic: false
  , scale: 0.09
  , stump: 0
}, {
  model: require('../models/trees/tree2.obj')
  , dynamic: false
  , scale: 0.08
  , stump: 0
}, {
  model: require('../models/trees/cactus4.obj')
  , dynamic: false
  , scale: 0.08
  , stump: 0
  , sink: 0.025
}, {
  model: require('../models/trees/cactus.obj')
  , dynamic: false
  , scale: 0.07
  , stump: 0
}, {
  model: require('../models/trees/cactus.obj')
  , dynamic: false
  , scale: 0.07
  , stump: 0
}]
