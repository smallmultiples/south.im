var normalize = require('vectors/normalize')(3)

module.exports = LightSystem

function LightSystem(options) {
  if (!(this instanceof LightSystem)) return new LightSystem(options)

  options = options || {}
  var directionals = options.directionals || 2
  var points = options.points || 2

  this.ambient = new Float32Array([0, 0, 0])
  this.lights = []
  this.points = []
  this.directionals = []

  for (var i = 0; i < directionals; i += 1) {
    var d = new DirectionalLight(i)
    this.lights.push(d)
    this.directionals.push(d)
  }

  for (var i = 0; i < points; i += 1) {
    var d = new PointLight(i)
    this.lights.push(d)
    this.points.push(d)
  }
}

LightSystem.prototype.bind = function(shader) {
  shader.uniforms.uAmbientLight = this.ambient
  var i = this.lights.length
  while (i--) this.lights[i].bind(shader)
}

function PointLight(id) {
  this.id = id
  this.color = new Float32Array(3)
  this.colorKey = 'uPLightCol_' + id
  this.position = new Float32Array(3)
  this.positionKey = 'uPLightPos_' + id
}

PointLight.prototype.bind = function(shader) {
  shader.uniforms[this.colorKey] = this.color
  shader.uniforms[this.positionKey] = this.position
}

function DirectionalLight(id) {
  this.id = id
  this.colorKey = 'uDLightCol_' + id
  this.color = new Float32Array(3)
  this.directionKey = 'uDLightDir_' + id
  this.direction = new Float32Array(3)
}

DirectionalLight.prototype.bind = function(shader) {
  shader.uniforms[this.colorKey] = this.color
  shader.uniforms[this.directionKey] = this.direction
}
