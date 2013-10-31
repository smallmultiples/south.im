const DURATION = require('../config.json').duration
const DISPLAY = require('../config.json').timeline

module.exports = function(timeline) {
  var el = document.createElement('div')
  var progress = document.createElement('div')
  var dragger = document.createElement('div')
  var timer = document.createElement('span')
  var self = {}

  if (!DISPLAY) {
    timer.style.display =
    el.style.display = 'none'
  }

  el.style.position = 'absolute'
  el.style.backgroundColor = 'rgba(255,255,255,0.65)'
  el.style.height = '30px'
  el.style.zIndex = 999
  el.style.bottom = 0
  el.style.left = 0
  el.style.right = 0
  el.style.cursor = 'pointer'

  timer.style.position = 'absolute'
  timer.style.top = '16px'
  timer.style.left = 0
  timer.style.right = 0
  timer.style.textAlign = 'center'
  timer.style.fontSize = '24px'
  timer.innerText = '0'

  dragger.style.position = 'absolute'
  dragger.style.top = 0
  dragger.style.bottom = 0
  dragger.style.width = '2px'
  dragger.style.marginLeft = '-1px'
  dragger.style.backgroundColor = '#f00'
  dragger.style.display = 'none'

  progress.style.position = 'absolute'
  progress.style.top = 0
  progress.style.bottom = 0
  progress.style.width = '4px'
  progress.style.marginLeft = '-2px'
  progress.style.backgroundColor = 'rgba(20, 20, 20, 0.8)'

  var dragging = false
  el.addEventListener('mouseover', function(e) {
    dragger.style.display = 'block'
  }, false)
  el.addEventListener('mouseout', function(e) {
    dragger.style.display = 'none'
    dragging = false
  }, false)
  el.addEventListener('mousemove', function(e) {
    dragger.style.left = e.x + 'px'
    if (dragging) timeline.shell.setTime((e.x / window.innerWidth) * DURATION)
  }, true)
  el.addEventListener('mousedown', function(e) {
    dragging = true
    timeline.shell.setTime((e.x / window.innerWidth) * DURATION)
  }, true)
  el.addEventListener('mouseup', function(e) {
    dragging = false
  }, true)

  document.body.appendChild(el)
  document.body.appendChild(timer)
  el.appendChild(progress)
  el.appendChild(dragger)

  self.tick = function(t) {
    timer.innerText = +t|0
    return progress.style.left = (100 * t / DURATION) + '%'
  }

  return self
}
