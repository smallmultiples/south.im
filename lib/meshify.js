var faceNormals = require('mesh-normals')
var createBuffer = require('gl-buffer')
var decode = require('tab64').decode
var createVAO = require('gl-vao')

module.exports = meshify

function meshify(gl, obj) {
  var data = basic(gl, obj)
  var mesh = createVAO(gl, null, data)

  return {
      mesh: mesh
    , length: data.size
  }
}

function basic(gl, obj) {
  var positions = decode(obj, 'float32')
  var normals = faceNormals(positions)

  var data = [{
      size: 3
    , type: gl.FLOAT
    , buffer: createBuffer(gl, positions)
  }, {
      size: 3
    , type: gl.FLOAT
    , buffer: createBuffer(gl, normals)
  }]

  data.size = positions.length / 3

  return data
}
