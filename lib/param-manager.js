const TWEAKABLE = require('../config.json').tweakable
var clone = require('clone')

module.exports = ParamManager

function ParamManager(shell) {
  if (!(this instanceof ParamManager)) return new ParamManager(shell)
  this.shell = shell
  this.keys = []
  this.prev = {}
  this.goal = {}
  this.curr = Object.create(null)

  this.curr['lut mix'] = { type: 'number', value: 0, min: 0, max: 1 }
  this.curr['lut 1'] = {
      type: 'choice'
    , left: true
    , value: 'normal'
    , choices: Object.keys(require('../dist/luts.json'))
  }
  this.curr['lut 2'] = {
      type: 'choice'
    , value: 'normal'
    , choices: Object.keys(require('../dist/luts.json'))
  }

  this.curr['mosaic amount'] = { type: 'number', value: 0, min: 0, max: 100, left: true }
  this.curr['rgb shift'] = { type: 'number', value: 0, min: 0, max: 5, left: true }
  this.curr['haze amount'] = { type: 'number', value: 0, min: 0, max: 2, left: true }

  this.curr['camera spin'] = { type: 'number', value: 0, min: -Math.PI, max: Math.PI, left: true }
  this.curr['camera angle'] = { type: 'number', value: 0, min: -3, max: 3, left: true  }
  this.curr['camera distance'] = { type: 'number', value: 0.75, min: 0.1, max: 5, left: true  }
  this.curr['fov'] = { type: 'number', value: 0.25, min: 0, max: 1, left: true  }
  this.curr['vignette'] = { type: 'array', value: new Float32Array([-0.25, -0.25, -0.25, 1.001]), min: -1.5, max: 1.5, left: true }

  this.curr['shark height'] = { type: 'number', value: 2, min: -2, max: 2 }
  this.curr['water level'] = { type: 'number', value: 12.125, min: 11, max: 15 }
  this.curr['water color'] = { type: 'array', value: new Float32Array([0.52, 1.06, 1.46]), min: 0, max: 2 }
  this.curr['egg brightness'] = { type: 'number', value: 1, min: 0, max: 3 }
  this.curr['egg color'] = { type: 'array', value: new Float32Array([1, 0.7, 0.4]), min: 0, max: 1 }
  this.curr['sky color'] = { type: 'array', value: new Float32Array([0, 0, 0, 1]), min: 0, max: 1 }
  this.curr['directional color 1'] = { type: 'array', value: new Float32Array([0, 0, 0]), min: 0, max: 1 }
  this.curr['directional color 2'] = { type: 'array', value: new Float32Array([0, 0, 0]), min: 0, max: 1 }
  this.curr['directional dir 1'] = { noColor: true, type: 'array', value: new Float32Array([1, 1, 1]), min: -1, max: 1 }
  this.curr['directional dir 2'] = { noColor: true, type: 'array', value: new Float32Array([1, 1, 1]), min: -1, max: 1 }
  this.curr['tree main color'] = { type: 'array', value: new Float32Array([0, 1, 1]), min: 0, max: 1, left: true }
  this.curr['tree stump color'] = { type: 'array', value: new Float32Array([1, 0, 1]), min: 0, max: 1, left: true }

  for (var k in this.curr) {
    this.keys.push(k)
    this.prev[k] = copy(this.curr[k])
    this.goal[k] = copy(this.curr[k])
  }

  this.curr = preprocess(this.curr)
  this.duration = 1000
  this.ticker = 0
}

ParamManager.prototype.tween = function(t) {
  var keys = this.keys
  for (var i = 0; i < keys.length; i += 1) {
    var k = keys[i]
    this.curr[k].value = this.tweener[
      this.curr[k].type
    ](this.curr[k].value
    , this.prev[k]
    , this.goal[k], t)
  }
}

ParamManager.prototype.tweener = {}
ParamManager.prototype.tweener.number = function(_, a, b, t) {
  return a + (b - a) * t
}
ParamManager.prototype.tweener.array = function(out, a, b, t) {
  for (var i = 0; i < out.length; i += 1)
    out[i] = a[i] + (b[i] - a[i]) * t
  return out
}

function preprocess(obj) {
  Object.keys(obj).forEach(function(key) {
    return obj[key] = wrap(obj[key])
  })

  return obj
}

function wrap(value) {
  if (typeof value === 'object' && 'length' in value) {
    return value = { type: 'array', value: value }
  }
  if (typeof value === 'object') {
    return value
  }
  if (typeof value === 'number') {
    return value = { type: 'number', value: value }
  }
}

function copy(value) {
  if (value instanceof Float32Array) return new Float32Array(value)
  return clone(value)
}
