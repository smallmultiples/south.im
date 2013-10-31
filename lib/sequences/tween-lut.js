module.exports = tweenLUT

function tweenLUT(params, between, target) {
  var current

  return between.on('start', function() {
    current = params['lut 1'].value
    params['lut mix'].value = 0
    params['lut 2'].value = target
  }).on('data', function(t) {
    params['lut mix'].value = t
  }).on('end', function() {
    params['lut 1'].value = target
    params['lut mix'].value = 0
  })
}
