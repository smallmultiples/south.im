// @todo clarify licensing requirements for the
// cubic interpolation function.

module.exports = cubic

function cubic(t) {
  var t2 = t * t
  var t3 = t2 * t
  return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75)
}

cubic['out'] = cubicOut
function cubicOut(t) {
  return ((--t)*t*t + 1)
}

cubic['in'] = cubicIn
function cubicIn(t) {
  return t*t*t
}
