const ORIGIN = (
  require('../config.json').generator.units / 2 /
  require('../config.json').terrain.chunk_size *
  require('../config.json').generator.scale
)
const CHUNK_SIZE = require('../config.json').terrain.chunk_size

var quat = require('gl-matrix').quat
var mat4 = require('gl-matrix').mat4
var terrain = require('./terrain')

module.exports = Speaker

function Speaker(gl, x, z, meshes, props) {
  this.gl = gl
  this.position = new Float32Array([x, terrain(x*(CHUNK_SIZE-1), z*(CHUNK_SIZE-1)), z])
  this.meshes = meshes
  this.matrix = mat4.identity(new Float32Array(16))

  this.matrices = this.meshes.map(function(mesh, i) {
    var matrix = mat4.identity(new Float32Array(16))
    var X = x - mesh.center_vertex[0]
    var Z = z - mesh.center_vertex[2]
    var normal = terrain.normal(X, Z)
    var pos = [
        this.position[0]
      , terrain(X*(CHUNK_SIZE-1), Z*(CHUNK_SIZE-1))
      , this.position[2]
    ]

    mat4.translate(matrix, matrix, pos)
    mat4.translate(matrix, matrix, [-mesh.center_vertex[0], -props.sink || 0, -mesh.center_vertex[2]])
    mat4.rotateY(matrix, matrix, Math.PI)
    if (props.rx) mat4.rotateX(matrix, matrix, -0.5 * normal[0])
    if (props.rz) mat4.rotateZ(matrix, matrix, -0.5 * normal[2])

    return matrix
  }.bind(this))

  mat4.translate(this.matrix, this.matrix, this.position)
  mat4.scale(this.matrix, this.matrix, [0.1, 0.1, 0.1])

  var normal = terrain.normal(x, z)

  mat4.rotateX(this.matrix, this.matrix, normal[0])
  mat4.rotateY(this.matrix, this.matrix, normal[1])
  mat4.rotateZ(this.matrix, this.matrix, normal[2])
}
