var uglify = require('uglify-js')
var buffer = ''

process.stdin.resume()
process.stdin.on('data', function(data) {
  buffer += data
}).once('end', function() {
  buffer = uglify.minify(buffer, {
    fromString: true
    , compress: true
    , output: {
        semicolons: false
      , space_colon: false
      , ascii_only: true
      , inline_script: true
    }
    , mangle: true
  }).code

  process.stdout.write(buffer)
})
