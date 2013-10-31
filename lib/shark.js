const ORIGIN = (
  require('../config.json').generator.units / 2 /
  require('../config.json').terrain.chunk_size *
  require('../config.json').generator.scale
)

var mat4 = require('gl-matrix').mat4

module.exports = Shark

function Shark(x, y, z, speed) {
  this.position = new Float32Array([x, 15, z])
  this.x = x
  this.y = y
  this.z = z
  this.speed = speed
  this.toff = Math.random() * 1000
  this.matrix = mat4.identity(new Float32Array(16))
  mat4.scale(this.matrix, this.matrix, [1, 1, 1])
}
