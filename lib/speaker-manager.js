const ORIGIN = (
  require('../config.json').generator.units / 2 /
  require('../config.json').terrain.chunk_size *
  require('../config.json').generator.scale
)

var camera = require('./camera-position')
var decode = require('tab64').decode
var faceNormals = require('mesh-normals')
var createBuffer = require('gl-buffer')
var createVAO = require('gl-vao')
var Speaker = require('./speaker')

var mat4 = require('gl-matrix').mat4
var vec3 = require('gl-matrix').vec3

module.exports = SpeakerManager

function SpeakerManager(gl) {
  if (!(this instanceof SpeakerManager)) return new SpeakerManager(gl)

  this.gl = gl
  this.speakers = require('./speaker-models').sort(function(a, b) {
    return a.z - b.z
  }).map(function(speaker) {
    var rotate = speaker.rotate || 0
    var meshes = meshify(gl, speaker.model, rotate, speaker.scale)
    if (!speaker.ignore) {
      camera.slowdowns.push(camera.inverse(speaker.z + ORIGIN - (speaker.tminus || 0.15)))
    }
    return new Speaker(gl, speaker.x + ORIGIN, speaker.z + ORIGIN, meshes, speaker)
  })
}

SpeakerManager.prototype.render = function(shader) {
  for (var i = 0; i < this.speakers.length; i += 1) {
    var speaker = this.speakers[i]
    for (var j = 0; j < speaker.meshes.length; j += 1) {
      shader.uniforms.uModel = speaker.matrices[j]
      speaker.meshes[j].bind()
      this.gl.drawArrays(this.gl.TRIANGLES, 0, speaker.meshes[j].length)
    }
  }
  speaker.meshes[j-1].unbind()
}

function meshify(gl, models, rotate, scale) {
  return models.map(function(model) {
    var positions = decode(model, 'float32')
    var normals = faceNormals(positions)

    var size = positions.length / 3
    var cx = 0
    var cy = 0
    var cz = 0
    var i

    if (rotate) {
      var transform = mat4.identity(new Float32Array(16))
      mat4.rotateY(transform, transform, rotate)
      mat4.scale(transform, transform, scale || [1, 1, 1])

      var vec = [0,0,0]
      i = 0
      while (i < positions.length) {
        var x = i, y = i+1, z = i+2
        vec[0] = positions[x]
        vec[1] = positions[y]
        vec[2] = positions[z]
        vec = vec3.transformMat4(vec, vec, transform)
        positions[x] = vec[0]
        positions[y] = vec[1]
        positions[z] = vec[2]
        i += 3
      }

      i = 0
      while (i < normals.length) {
        var x = i, y = i+1, z = i+2
        vec[0] = normals[x]
        vec[1] = normals[y]
        vec[2] = normals[z]
        vec = vec3.transformMat4(vec, vec, transform)
        normals[x] = vec[0]
        normals[y] = vec[1]
        normals[z] = vec[2]
        i += 3
      }
    }

    i = 0
    while (i < positions.length) {
      positions[i++] *= 0.2
      positions[i++] *= 0.2
      positions[i++] *= 0.2
    }

    i = 0
    while (i < positions.length) {
      cx += positions[i++] / size
      cy += positions[i++] / size
      cz += positions[i++] / size
    }

    i = 0
    while (i < positions.length) {
      positions[i++] -= cx
      i++
      positions[i++] -= cz
    }

    var vao = createVAO(gl, null, [{
        type: gl.FLOAT
      , size: 3
      , buffer: createBuffer(gl, positions)
    }, {
        type: gl.FLOAT
      , size: 3
      , buffer: createBuffer(gl, normals)
    }])

    vao.length = size
    vao.center_vertex = new Float32Array([cx, cy, cz])

    return vao
  })
}
