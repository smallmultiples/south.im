// Calculates the centroid positions of
// triangular meshes.

module.exports = centroid

function centroid(mesh) {
  var arr = new Float32Array(mesh.length)
  var l = mesh.length
  var n = 0
  var m = 0

  for (var v = 0; v < l; v += 9) {
    var x = mesh[v+0] + mesh[v+3] + mesh[v+6]
    var y = mesh[v+1] + mesh[v+4] + mesh[v+7]
    var z = mesh[v+2] + mesh[v+5] + mesh[v+8]

    arr[v+0] = arr[v+3] = arr[v+6] = x/3
    arr[v+1] = arr[v+4] = arr[v+7] = y/3
    arr[v+2] = arr[v+5] = arr[v+8] = z/3
  }

  return arr
}
