var _ = require('underscore')

var routes = function(server, Lighting) {

  server.route({
    method: 'GET',
    path: '/lighting',
    config: {
      handler: function(req, res) {
        res(_.map(Lighting.list(), Lighting.serializeLight.bind(Lighting)))
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/lighting/{location}',
    config: {
      handler: function(req, res) {
        node = Lighting.find(req.params.location)
        res(Lighting.serializeLight(node))
      }
    }
  })

  server.route({
    method: 'PUT',
    path: '/lighting/{location}',
    config: {
      handler: function(req, res) {
        node = Lighting.find(req.params.location)
        node.update(req.payload)
        res(node)
      }
    }
  })

}

module.exports = routes
