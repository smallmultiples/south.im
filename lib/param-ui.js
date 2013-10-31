var EventEmitter = require('events').EventEmitter
var h = require('hyperscript')
var clamp = require('clamp')

module.exports = paramUI

var relabels = {
    'haze amount': 'Heat Haze'
  , 'mosaic amount': 'Pixellation'
  , 'lut 1': 'Color Grading'
  , 'rgb shift': 'RGB Shift'
  , 'fov': 'Field of View'
  , 'camera spin': 'Camera Spin'
  , 'camera angle': 'Camera Angle'
  , 'camera distance': 'Camera Distance'
  , 'vignette': 'Vignette Color/Opacity'
  , 'water level': 'Water Height'
  , 'water color': 'Water Color'
  , 'egg brightness': 'Point Light Brightness'
  , 'egg color': 'Point Light Color'
  , 'sky color': 'Sky Color'
  , 'directional color 1': 'Sunlight Color 1'
  , 'directional color 2': 'Sunlight Color 2'
  , 'directional dir 1': 'Sunlight Angle 1'
  , 'directional dir 2': 'Sunlight Angle 2'
}

function paramUI(scene, params) {
  var status = h('div.status', '100')
  var ui = h('div.sidebar')
  var lui = h('div.sidebar.left')
  var wrap = h('div', ui, lui, status)

  var emitter = new EventEmitter
  emitter.setMaxListeners(0)

  Object.keys(params).forEach(function(key) {
    if (/lut (?:2|mix)/g.test(key)) return
    var isLeft = params[key].left
    var tweak = tweaker[params[key].type](emitter, isLeft ? lui : ui, params[key], relabels[key] || key, status)
  })

  document.body.addEventListener('mousemove', function(e) {
    emitter.emit('mousemove', e)
  }, false)
  document.body.addEventListener('mouseup', function(e) {
    status.style.display = 'none'
    document.body.style.cursor = 'default'
    emitter.emit('mouseup', e)
  }, false)
  document.body.addEventListener('mouseleave', function(e) {
    status.style.display = 'none'
    document.body.style.cursor = 'default'
    emitter.emit('mouseup', e)
  }, false)

  return wrap
}

function slider(el, events, title, height, status, color) {
  var emitter = new EventEmitter

  var inner = h('div.slider-inner')
  var wrap = emitter.el = h('div.slider-wrap', inner)
  var dragging = false
  var offsetx
  var startx
  var startw

  var slider = h('div.slider'
    , title ? h('h2.slider-title', title) : ''
    , wrap
  )

  if (height) {
    wrap.style.height = height + 'px'
  }

  status.style.display = 'none'
  wrap.addEventListener('mousedown', function(e) {
    status.style.display = 'block'
    document.body.style.cursor = 'ew-resize'
    dragging = true
    offsetx = e.offsetX
    startx = e.x - e.offsetX
    startw = wrap.getBoundingClientRect().width
  }, false)

  events.on('mousemove', function(e) {
    if (!dragging) return
    var percent = clamp((e.x - startx) / startw, 0, 1)
    emitter.setPercent(percent)
    emitter.emit('update', percent)
  }).on('mouseup', function(e) {
    dragging = false
  })

  if (color) {
    inner.style.backgroundColor = color
  }

  emitter.setPercent = function(percent) {
    inner.style.width = clamp(percent*100, 0, 100) + '%'
  }

  el.appendChild(slider)

  return emitter
}

var tweaker = {}
var arrayColors = [
    '#fcc'
  , '#cfc'
  , '#ccf'
  , '#fff'
]

tweaker.array = function(events, ui, property, title, status) {
  for (var i = 0; i < property.value.length; i++) (function(key) {
    var color = arrayColors[i]
    if (property.noColor) color = '#fff'
    var slide = slider(ui, events, i ? null : title, 10, status, color).on('update', function(percent) {
      var value = property.value[key] = property.min + (property.max - property.min) * percent
      status.innerText = value.toFixed(3)
    })

    if (i) slide.el.classList.add('no-top')
    if (i+1 < property.value.length) slide.el.classList.add('no-bottom')
    slide.setPercent((property.value[key] - property.min) / (property.max - property.min))
  })(i)
}

tweaker.number = function(events, ui, property, title, status) {
  var slide = slider(ui, events, title, 14, status).on('update', function(percent) {
    var value = property.value = property.min + (property.max - property.min) * percent
    status.innerText = value.toFixed(3)
  })
  slide.setPercent((property.value - property.min) / (property.max - property.min))
}

tweaker.choice = function(events, ui, property, title, status) {
  var choice = h('select')
  var wrap = h('div.slider'
    , title ? h('h2.slider-title', title) : ''
    , choice
  )

  var choices = property.choices
  for (var i = 0; i < choices.length; i++) {
    var opt = h('option', choices[i])
    choice.add(opt)
  }

  choice.value = property.value
  choice.addEventListener('change', function() {
    property.value = choice.value
  }, false)

  ui.appendChild(wrap)
}
