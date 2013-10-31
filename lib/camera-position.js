// Controls the camera's position
// over time. Essentially, it moves in
// exclusively in a straight line, but
// also slows down in proximity to speaker
// names and stops when reaching the mountain.

var max = Math.max
var min = Math.min
var sin = Math.sin
var pi = Math.PI

const SLOWDOWN_AMOUNT = 0.6
const SLOWDOWN_PERIOD = 0.00065
const LIMIT = 191648
const SPEED = 0.000550
const TWEAKABLE = require('../config.json').tweakable
const ORIGIN = (
  require('../config.json').generator.units / 2 /
  require('../config.json').terrain.chunk_size *
  require('../config.json').generator.scale
)

if (!TWEAKABLE) {
  module.exports = function(ct) {
    if (ct > LIMIT) ct = LIMIT
    var pos = ORIGIN + ct * SPEED
    for (var i = 0; i < slowdowns.length; i += 1) {
      pos -= sin(min(max((ct - slowdowns[i]) * SLOWDOWN_PERIOD, 0), pi)) * SLOWDOWN_AMOUNT
    }
    return pos
  }

  module.exports.inverse = function(position) {
    var ct = (position - ORIGIN) / SPEED
    return ct > LIMIT ? LIMIT : ct
  }
} else {
  module.exports = function(ct) {
    return ORIGIN + Math.sin(ct / 180000) * 110
  }

  module.exports.inverse = function(position) {
    return Math.asin(position / 110) * 180000 - ORIGIN
  }
}

var slowdowns = module.exports.slowdowns = [LIMIT - 1500]
