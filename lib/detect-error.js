var fs = require('fs')

var errorTemplate = fs.readFileSync(__dirname + '/detect-error.html')
var detectedError = false

module.exports = detectError
module.exports.passed = false

var support = {
  audio: (
    typeof AudioContext !== 'undefined' ||
    typeof webkitAudioContext !== 'undefined'
  ),
  workers: !!window.Worker,
  indexeddb: !!window.indexedDB,
  webgl: false
}

try {
  var c = document.createElement('canvas')
  support.webgl = c.getContext('webgl') && true
} catch(e) {
  try {
    support.webgl = support.webgl || (c.getContext('experimental-webgl') && true)
  } catch(e) {
    support.webgl = false
  }
}

;(function() {
  if (!support.webgl) return detectError('WebGL', 'http://get.webgl.org/')
  if (!support.audio) return detectError('Web Audio API', 'http://www.w3.org/TR/2013/WD-webaudio-20131010/')
  if (!support.workers) return detectError('Web Worker', 'http://en.wikipedia.org/wiki/Web_worker')
  if (!support.indexeddb) return detectError('IndexedDB', 'https://developer.mozilla.org/en/docs/IndexedDB')
  module.exports.passed = true
})()

function detectError(feature, link) {
  var err = document.createElement('div')

  if (detectedError) return
  detectedError = true

  err.innerHTML = errorTemplate
    .replace('{{feature}}', feature)
    .replace('{{link}}', link)

  document.body.appendChild(err)
}
