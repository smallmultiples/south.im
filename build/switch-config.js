var args = process.argv.slice(2)
var key = args[0]
var value = JSON.parse(args[1])

var config = require('../config.json')
config[key] = value
config = JSON.stringify(config, null, 2)

require('fs').writeFile(__dirname + '/../config.json', config, function(err) {
  if (err) throw err
})
