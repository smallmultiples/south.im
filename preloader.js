var detection = require('./lib/detect-error')
var preload = require('preload')(10)

const TWEAKABLE = require('./config.json').tweakable
const UNIT_CHUNKS = (
  require('./config.json').generator.units /
  require('./config.json').generator.chunk
)

var errored = false
window.onerror = function(message) {
  if (errored) return
  var errorNode = document.createElement('div')
  errorNode.setAttribute('class', 'error')
  errorNode.innerText = message
  document.body.appendChild(errorNode)
  errored = true
}

if (detection.passed) require('domready')(function() {
  var loader = require('loading-bar')('#FFF').append(document.body)

  for (var x = 0; x < UNIT_CHUNKS; x += 1)
  for (var y = 0; y < UNIT_CHUNKS; y += 1) {
    preload.img('dist/terrain-chunk-'+prefix(x)+'x'+prefix(y)+'.png')
  }

  ;['img/credit-francois.png'
  , 'img/credit-hugh.png'
  , 'img/credit-jack.png'
  , 'img/credit-south.png'
  , 'img/credit-thomas.png'
  , 'img/open-html5.png'
  ].concat(values(
    require('./dist/luts.json')
  )).forEach(function(src) {
    preload.img(src)
  })

  preload.js(TWEAKABLE ? 'dist/tweakable-wds.min.js' : 'dist/wds.min.js')
  preload.on('progress', function(src, progress, total) {
    loader.update(total)
  })

  preload.once('done', function() {
    setTimeout(function() {
      loader.fadeout(1000)
    }, 1000)
  })
})

function prefix(n) {
  n = String(n)
  while (n.length < 3) n = '0' + n
  return n
}

function values(o) {
  var vals = []
  for (var k in o) {
    vals.push(o[k])
  }
  return vals
}
