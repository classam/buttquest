/*
 * Get a list of the IP addresses of this server.
 */
var os = require("os");
var _ = require("lodash");

module.exports = exports = function(){
  var netifaces = os.networkInterfaces();
  var ips = _.flatten(_.map(netifaces, function(iface){
    var ifaces = _.filter(iface, function(address_obj){
      return address_obj.family == 'IPv4' && !address_obj.internal
    });
    return _.pluck(ifaces, 'address');
  }));
  return ips;
}

