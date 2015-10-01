// I honestly think that localStorage should work like this anyways
// but hey, let's toss in an extra layer of indirection :3
var serializingLocalStorage = {}

serializingLocalStorage.setItem = function(key, data){
  console.log("Serializing ", key);
  var serialized = JSON.stringify(data);
  return localStorage.setItem(key, data);
}

serializingLocalStorage.getItem = function(key){
  var serialized = localStorage.getItem(key);
  if(serialized === null){
    return null;
  }
  return JSON.parse(serialized);
}

if(typeof(module) !== 'undefined'){
  module.exports = serializingLocalStorage;
}
