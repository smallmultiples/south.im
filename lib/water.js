var mat4 = require('gl-matrix').mat4
var heightmap = require('heightmap-mesher')
var createBuffer = require('gl-buffer')
var createVAO = require('gl-vao')
var zeros = require('zeros')

module.exports = water

function water(shell) {
  var gl = shell.gl
  var detail = 96
  var hm = zeros([detail, detail])
  var positions = heightmap(hm)
  var normals = new Float32Array(positions.length)
  var size = positions.length / 3

  // Random "normal" vectors for shading
  for (var i = 0; i < positions.length;) {
    positions[i] -= 0.5
    normals[i++] = Math.random()
    normals[i++] = Math.random()
    positions[i] -= 0.5
    normals[i++] = Math.random()
  }

  var vertices = createVAO(gl, null, [{
      type: gl.FLOAT
    , size: 3
    , buffer: createBuffer(gl, positions)
  }, {
      type: gl.FLOAT
    , size: 3
    , buffer: createBuffer(gl, normals)
  }])

  var matrix = mat4.identity(new Float32Array(16))
  var scale = 10
  var res = scale / detail
  var translate = [0,0,0]

  scale = [scale, scale, scale]
  vertices.level = 0

  //
  // The water just exists as a grid which is always relative
  // to the X/Z position of the camera - effectively, it follows
  // the camera around. This makes rendering water a little
  // simpler and less expensive.
  //
  vertices.render = function(shader) {
    mat4.identity(matrix)
    translate[0] = shell.camera.center[0]
    translate[2] = shell.camera.center[2]
    translate[1] = vertices.level

    mat4.translate(matrix, matrix, translate)
    mat4.scale(matrix, matrix, scale)
    shader.uniforms.uModel = matrix

    vertices.bind()
    gl.drawArrays(gl.TRIANGLES, 0, size)
    vertices.unbind()
  }

  return vertices
}
