//
// Crops our color grading LUTs (see
// the `img/luts` directory).
//
// It's nicer to keep LUTs with
// their original processed screenshot
// to quickly scan through their actual
// effects on the scene. The vignette
// distorts some of the effects but otherwise
// the screenshot is a 1-to-1 preview.
//

var fill = require('ndarray-fill')
var save = require('save-pixels')
var through = require('through')
var read = require('get-pixels')
var async = require('async')
var zeros = require('zeros')
var path = require('path')
var fs = require('fs')

module.exports = trim

function trim(callback) {
  var dir = __dirname + '/../img/luts/'
  fs.readdir(dir, function(err, luts) {
    if (err) return callback(err)

    luts = luts.filter(function(name) {
      return /\.png$/.test(name)
    })

    async.mapLimit(luts, 10, function(name, next) {
      var file = path.resolve(dir, name)
      var dest = path.resolve(dir, '../../dist/lut-' + name)

      read(file, function(err, data) {
        if (err) return next(err)

        var out = fs.createWriteStream(dest)

        save(convert(data), 'png')
          .pipe(out)
          .once('error', next)
          .once('close', function() {
            console.error('trimmed ' + file + '...')

            dest = path.relative(__dirname + '/..', dest)
            name = name.replace(/\.png/g, '')

            next(null, { uri: dest, name: name })
          })
      })
    }, function(err, luts) {
      if (err) return callback(err)

      luts = luts.reduce(function(memo, value) {
        memo[value.name] = value.uri
        return memo
      }, {})

      fs.writeFile(
          __dirname + '/../dist/luts.json'
        , JSON.stringify(luts)
        , callback
      )
    })
  })
}

function convert(data) {
  return copy(data.hi(33, 33*33, 4))
}

function copy(array) {
  var out = zeros(array.shape)
  fill(out, function(x, y, z) {
    return array.get(x, y, z)
  })
  return out
}
