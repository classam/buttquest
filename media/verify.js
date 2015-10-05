if(typeof(module) !== 'undefined'){
  var _ = require('lodash');
  var StackTrace = require('stacktrace-js');
}


/* verify's only function is: it checks that all of the variables
 * passed in as arguments are not undefined. if they are undefined
 * verify throws an error */
function verify(){
  var callback = function(stackframes) {
    var stringifiedStack = stackframes.map(function(sf) {
      return sf.toString();
    }).join('\n');
    console.error(stringifiedStack);
  };
  var errback = function(err) { console.error(err.message); };

  var argumentsArray = [].slice.apply(arguments);
  _.forEach(argumentsArray, function(arg){
    if(typeof(arg) === 'undefined'){
      console.error("Argument missing!");
      StackTrace.get().then(callback).catch(errback)
    }
  });
}

if(typeof(module) !== 'undefined'){
  module.exports = verify;
}
