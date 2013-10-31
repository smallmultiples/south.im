module.exports = function(between, fn) {
  return between.on('data', function(t) {
    fn(t)
  }).on('start', function(t) {
    fn(0)
  }).on('end', function(t) {
    fn(1)
  })
}
