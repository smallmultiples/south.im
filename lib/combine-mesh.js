// Takes a series of arrays and combines them
// into a single `Float32Array`. Used for quickly
// combining meshes imported from Blender.

module.exports = combine

function combine(arrs) {
  var size = arrs.reduce(function(a, b) {
    return a + b.length
  }, 0)

  var arr = new Float32Array(size)
  var n = 0
  for (var i = 0; i < arrs.length; i += 1)
  for (var j = 0; j < arrs[i].length; j++) {
    arr[n++] = arrs[i][j]
  }

  return arr
}
