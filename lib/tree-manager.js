const CHUNK_SIZE = require('../config.json').terrain.chunk_size
const TREE_DENSITY = require('../config.json').trees.density
const ORIGIN = (
  require('../config.json').generator.units / 2 /
  require('../config.json').terrain.chunk_size *
  require('../config.json').generator.scale
)

var EventEmitter = require('events').EventEmitter
var terrain = require('./terrain')
var biomes = require('../build/biomes')
var Tree = require('./tree')
var ceil = Math.ceil
var abs = Math.abs

var speakers = require('./speaker-models').map(function(d) {
  return { x: d.x + ORIGIN, y: d.z + ORIGIN }
})

module.exports = TreeManager

function TreeManager(shell) {
  var gl = shell.gl
  var self = new EventEmitter
  var params = shell.params.curr
  var trees = {}

  shell.field.on('created', function(chunk) {
    var key = chunk.position.join('|')
    var cpx = chunk.position[0]
    var cpy = chunk.position[1]
    trees[key] = []

    var biomelevels = terrain.biome(cpx, cpy)

    allBiomes: for (var k = 0; k < biomelevels.length; k += 1) {
      var density = biomes[k].density*biomelevels[k]
      var foliage = biomes[k].foliage
      var lastchance = density % 1
      var safezone = biomes[k].safezone || 0.3

      density = ceil(density)

      fillPerBiome: for (var i = 0, n = 0; i < density; i += 1) {
        var x = (cpx + Math.random())
        var y = (cpy + Math.random())

        if (abs(x - ORIGIN) < safezone) continue
        if (i+1 >= density && Math.random() > lastchance) continue

        for (var j = 0; j < speakers.length; j++) {
          var dx = x-speakers[j].x
          var dy = y-speakers[j].y
          var d = dx*dx + dy*dy
          if (d < 0.4) continue fillPerBiome
        }

        trees[key][n++] = new Tree(shell, x, y, foliage)
      }
    }

    trees[key].sort(function(a, b) {
      return a.model.id - b.model.id
    })
  }).on('removed', function(chunk) {
    var key = chunk.position.join('|')
    var forest = trees[key]
    delete trees[key]
  })

  self.render = render
  function render(shader) {
    shader.uniforms.uTreeColor = params['tree main color'].value
    shader.uniforms.uTreeStumpColor = params['tree stump color'].value

    for (var k in trees) {
      var forest = trees[k]
      var size = 0
      var last = -1
      for (var i = 0; i < forest.length; i++) {
        var tree = forest[i]
        if (!tree.draw) continue
        var curr = tree.model.id
        shader.uniforms.uModel = tree.matrix
        if (last !== curr) {
          tree.vertices.bind()
          size = tree.vertices.length
          last = curr
        }
        gl.drawArrays(gl.TRIANGLES, 0, size)
      }
      if (tree && tree.vertices)
        tree.vertices.unbind()
    }
  }

  return self
}
