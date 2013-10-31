var presets = require('../presets.json')

module.exports = tweenPresets

function identity(t) {
  return t
}

function tweenPresets(params, between, preset, ease) {
  var previous = {}
  var keys

  ease = ease || identity
  if (typeof preset === 'string') {
    preset = presets[preset]
  }

  return between.on('start', function() {
    keys = Object.keys(preset)
    keys.forEach(function(key) {
      previous[key] = copy(params[key].value)
    })
  }).on('data', function(t) {
    for (var i = 0; i < keys.length; i += 1) {
      tween(
          previous[keys[i]]
        , preset[keys[i]]
        , params[keys[i]]
        , ease(t)
      )
    }
  }).on('end', function() {
    for (var i = 0; i < keys.length; i += 1) {
      tween(
          previous[keys[i]]
        , preset[keys[i]]
        , params[keys[i]]
        , 1
      )
    }
  })
}

var slice = Array.prototype.slice

function copy(val) {
  if (Array.isArray(val)) return val.slice()
  if (val instanceof Float32Array) {
    return new Float32Array(slice.call(val))
  }

  return val
}

function tween(prev, goal, curr, t) {
  if (goal instanceof Float32Array) {
    for (var i = 0; i < goal.length; i += 1) {
      curr.value[i] = prev[i] + (goal[i] - prev[i]) * t
    }
  } else
  if (typeof goal === 'number') {
    curr.value = prev + (goal - prev) * t
  }
}
