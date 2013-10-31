//
// Responsible for inlining our model files
// such that they can be loaded as base64-encoded
// strings.
//

var unindex = require('unindex-mesh')
var encode = require('tab64').encode
var through = require('through')
var obj = require('dot-obj')
var fs = require('fs')

module.exports = objify

function objify(file) {
  if (!/\.obj$/g.test(file)) return through()
  var buffer = ''
  var stream

  return stream = through(write, end)
  function write(data) {
    buffer += data
  }
  function end() {
    stream.queue('module.exports = [')
    var models = obj(buffer)

    for (var i = 0; i < models.length; i += 1) {
      var model = models[i]
      var positions = unindex(model.positions, model.cells)

      if (i) stream.queue(',')
      stream.queue('"')
      stream.queue(encode(positions).replace(/\s/g, ''))
      stream.queue('"')
    }

    stream.queue(']')
    stream.queue(null)
  }
}
