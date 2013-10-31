module.exports = Logo

function Logo(src, width, height, top) {
  if (!(this instanceof Logo)) return new Logo(src, width, height, top)
  this.visible = false
  width = width || 600
  height = height || 200
  top = top || 0.8
  var img = this.img = document.createElement('img')
  img.src = this.src = src
  img.style.width = width + 'px'
  img.style.height = height + 'px'
  img.style.position = 'absolute'
  img.style.top = (top * 100) + '%'
  img.style.left = '50%'
  img.style.marginLeft = '-' + (width/2) + 'px'
  img.style.marginTop = '-' + (height/2) + 'px'
  img.style.zIndex = 9999
  img.style.opacity = 0
  img.style.display = 'none'
  document.body.appendChild(img)
}

Logo.prototype.fade = function(x) {
  var visible = x > 0.0001
  var changed = visible !== this.visible
  this.img.style.opacity = x
  this.visible = visible
  if (changed) {
    this.img.style.display = visible ? 'block' : 'none'
  }
}
