module.exports = duration

function duration(start, end) {
  end -= start
  return function(t) {
    return start + end * t
  }
}
