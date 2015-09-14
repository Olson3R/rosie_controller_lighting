var _ = require('underscore')

var Lighting = function(server, options) {
  this.ZwaveModel = server.plugins['rosie_controller_zwave']['ZwaveModel']
}

Lighting.prototype.list = function() {
  return _.each(this.ZwaveModel.lights(), this.serializeLight)
}

Lighting.prototype.find = function(location) {
  return _.find(this.list(), function(light) {
    return light.location.toLowerCase() === location.toLowerCase()
  })
}

Lighting.prototype.update = function(location, attributes) {
  var light = this.find(location)
  if (!light) return false

  var classAttributes = {}
  if (light.isSwitchBinary()) {
    classAttributes[this.ZwaveModel.COMMAND_CLASS_SWITCH_BINARY] = updateSwitchBinary(attributes)
  }
  else if (light.isSwitchMultilevel()) {
    classAttributes[this.ZwaveModel.COMMAND_CLASS_SWITCH_MULTILEVEL] = updateSwitchMultilevel(attributes)
  }

  return light.update({'classes': classAttributes})
}

Lighting.prototype.serializeLight = function(light) {
  if (!light) return null

  var serializedLight = this.serializeLightBase(light)
  if (light.isSwitchBinary()) {
    _.extend(serializedLight, this.serializeSwitchBinary(light))
  }
  if (light.isSwitchMultilevel()) {
    _.extend(serializedLight, this.serializeSwitchMultilevel(light))
  }
  return serializedLight
}

Lighting.prototype.serializeLightBase = function(light) {
  return {
    location: light.location
  }
}

Lighting.prototype.serializeSwitchBinary = function(light) {
  return {
    switch: light.classes[this.ZwaveModel.COMMAND_CLASS_SWITCH_BINARY]['0']['value']
  }
}

Lighting.prototype.serializeSwitchMultilevel = function(light) {
  return {
    level: light.classes[this.ZwaveModel.COMMAND_CLASS_SWITCH_MULTILEVEL]['0']['value']
  }
}

function updateSwitchBinary(attribtutes) {
  return {
    '0': { // Switch
      'value': attribtues['switch'].toLowerCase() === 'on' ? true : false
    }
  }
}

function updateSwitchMultilevel(attribtutes) {
  return {
    '0': { // Level
      'value': attribtues['level']
    }
  }
}

module.exports = Lighting
