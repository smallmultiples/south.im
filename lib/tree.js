const CHUNK_SIZE = require('../config.json').terrain.chunk_size
const TREE_SCALE_WOBBLE = require('../config.json').trees.scale_wobble / 2
var tau = Math.PI * 2

var createBuffer = require('gl-buffer')
var createVAO    = require('gl-vao')
var mat4 = require('gl-matrix').mat4
var vec3 = require('gl-matrix').vec3

var terrain = require('./terrain')
var combine = require('./combine-mesh')
var normals = require('mesh-normals')
var decode = require('tab64').decode
var centroid = require('./centroid')

module.exports = Tree

var mids = 0
var modelCache = require('./tree-models')

var models = Object.keys(modelCache).reduce(function(models, key) {
  models[key] = modelCache[key].map(function(model) {
    var objects = model.model
    var results = []

    // Already decoded, use previous
    if (model.meshed) return model.meshed

    for (var i = 0; i < objects.length; i += 1) {
      var opos = decode(objects[i], 'float32')
      var stump = new Float32Array(opos.length / 3)
      var norm = normals(opos)
      if (model.scale) for (var j = 0; j < opos.length; j++) opos[j] *= model.scale
      if (model.sink) for (var j = 0; j < opos.length; j++) opos[j] -= model.sink
      var cent = centroid(opos)
      var stumpval = model.stump === i ? 1 : 0
      for (var j = 0; j < stump.length; j++) stump[j] = stumpval
      var cpt = [0,0,0]
      for (var j = 0; j < opos.length; j += 3) {
        cpt[0] += opos[j  ]
        cpt[1] += opos[j+1]
        cpt[2] += opos[j+2]
      }
      cpt[0] /= opos.length / 3
      cpt[1] /= opos.length / 3
      cpt[2] /= opos.length / 3
      var center = new Float32Array(opos.length)
      for (var j = 0; j < opos.length; j += 3) {
        center[j  ] = cpt[0]
        center[j+1] = cpt[1]
        center[j+2] = cpt[2]
      }
      results[i] = { positions: opos, normals: norm, stump: stump, centroid: cent, center: center }
    }

    var positions = combine(results.map(function(d) { return d.positions }))
    var centroids = combine(results.map(function(d) { return d.centroid }))
    var centers = combine(results.map(function(d) { return d.center }))
    var normal = combine(results.map(function(d) { return d.normals }))
    var stumps = combine(results.map(function(d) { return d.stump }))

    model.meshed = {
      positions: positions
      , centroids: centroids
      , centers: centers
      , normals: normal
      , stump: stumps
      , id: mids++
    }

    return model
  })

  return models
}, {})

function Tree(shell, x, z, foliage, model) {
  if (!(this instanceof Tree)) return new Tree(shell, x, z, foliage, model)
  var group = models[foliage || 'trees']
  if (arguments.length < 5) {
    model = Math.floor(Math.random()*group.length)
  }

  var scale = 1 + (Math.random() - 0.5) * TREE_SCALE_WOBBLE
  var y = terrain(x*(CHUNK_SIZE-1), z*(CHUNK_SIZE-1)) - 0.0125
  var gl = shell.gl

  this.gl = gl
  this.draw = foliage === 'buildings' || y > shell.params.curr['water level'].value
  this.modelindex = model
  this.model = group[model].meshed
  this.position = [x, y, z]
  this.matrix = mat4.identity(new Float32Array(16))
  mat4.translate(this.matrix, this.matrix, this.position)
  mat4.scale(this.matrix, this.matrix, [scale,scale,scale])
  mat4.rotateY(this.matrix, this.matrix, (Math.random() * tau))
  mat4.rotateX(this.matrix, this.matrix, (Math.random() - 0.5) * 0.3)

  if (this.draw && !this.model.vao) {
    this.model.vao = createVAO(gl, null, [{
        type: gl.FLOAT
      , size: 3
      , buffer: createBuffer(gl, this.model.positions)
    }, {
        type: gl.FLOAT
      , size: 3
      , buffer: createBuffer(gl, this.model.normals)
    }, {
        type: gl.FLOAT
      , size: 1
      , buffer: createBuffer(gl, this.model.stump)
    }, {
        type: gl.FLOAT
      , size: 3
      , buffer: createBuffer(gl, this.model.centroids)
    }, {
        type: gl.FLOAT
      , size: 3
      , buffer: createBuffer(gl, this.model.centers)
    }])
    this.model.vao.length = this.model.positions.length / 3
  }

  this.vertices = this.model.vao
}

Tree.prototype.draw = function(shader) {
  var vertices = this.vertices
  var gl = this.gl
}
