var createBuffer = require('gl-buffer')
var createVAO = require('gl-vao')
var mat4 = require('gl-matrix').mat4
var perlin = require('perlin').noise.perlin2

var EventEmitter = require('events').EventEmitter
var sharkModel = require('./shark-model')
var Shark = require('./shark')

module.exports = SharkManager

function SharkManager(shell) {
  var gl = shell.gl
  var self = new EventEmitter
  var params = shell.params.curr
  var sharks = [
      new Shark(0.3, 0, 0.2, 0.05)
    , new Shark(-0.5, 0, -0.2, 0.08)
    , new Shark(0.25, 0, -0.4, 0.02)
  ]

  var sharkVertices = createVAO(gl, null, [{
      type: gl.FLOAT
    , size: 3
    , buffer: createBuffer(gl, sharkModel.positions)
  }, {
      type: gl.FLOAT
    , size: 3
    , buffer: createBuffer(gl, sharkModel.normals)
  }])

  sharkVertices.length = sharkModel.positions.length / 3

  var scratch = new Float32Array(16)
  var scale = new Float32Array([0.05, 0.05, 0.05])

  self.render = render
  function render(shader) {
    var size = sharkVertices.length
    var origin = shell.lights.points[0].position
    var height = params['shark height'].value
    if (height >= 2) return

    sharkVertices.bind()
    for (var i = 0; i < sharks.length; i += 1) {
      var shark = sharks[i]

      shark.position[0] =  origin[0] + shark.x
      shark.position[0] += perlin(0.2401, shark.position[0]) * 0.5

      var yoff = (perlin(0.9401, shark.position[0] * 20) + 0.25) * 0.5
      shark.position[1] += (origin[1] - shark.position[1] + height + shark.y + yoff) * shark.speed

      shark.position[2] =  origin[2] + shark.z
      shark.position[2] += perlin(0.2401, shark.position[2] * 0.5) * 0.5

      mat4.identity(scratch)
      mat4.translate(scratch, scratch, shark.position)
      mat4.scale(scratch, scratch, scale)
      shader.uniforms.uModel = scratch
      shader.uniforms.uOffset = shark.toff
      gl.drawArrays(gl.TRIANGLES, 0, size)
    }

    sharkVertices.unbind()
  }

  return self
}
