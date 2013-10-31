var detect = require('beats')([
  { lo: 0, hi: 32, threshold: 140, decay: 0.001 }
], 500)

module.exports = function(shell) {
  return function(dt) {
    shell.audio.frequencies(shell.frequencies)
    return detect(shell.frequencies, dt)
  }
}
