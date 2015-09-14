var Lighting = require('./lib/lighting')
var routes = require('./lib/routes')

var register = function(server, options, next) {
  var lighting = new Lighting(server, options)
  server.expose('lighting', lighting)

  routes(server, lighting)

  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register
