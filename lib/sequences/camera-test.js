var duration = require('../duration')

module.exports = function(shell, params, time) {
  return function(start, end) {
    var frame = duration(start, end)
  }
}
