var model = require('../models/animals/shark.obj')
var combine = require('./combine-mesh')
var normals = require('mesh-normals')
var decode = require('tab64').decode
var results = []

for (var i = 0; i < model.length; i += 1) {
  var pos = decode(model[i], 'float32')
  var nor = normals(pos)
  results.push({ positions: pos, normals: nor })
}

module.exports = {
  positions: combine(results.map(function(n) { return n.positions }))
  , normals: combine(results.map(function(n) { return n.normals }))
}
