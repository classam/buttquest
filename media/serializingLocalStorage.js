// I honestly think that localStorage should work like this anyways
// but hey, let's toss in an extra layer of indirection :3
var serializingLocalStorage = {}

serializingLocalStorage.setItem = function(key, data){
  verify(key, data);
  //console.log("Serializing ", key);
  var serialized = JSON.stringify(data);
  return localStorage.setItem(key, serialized);
}

serializingLocalStorage.getItem = function(key){
  verify(key);
  var serialized = localStorage.getItem(key);
  if(serialized === null){
    return null;
  }
  return JSON.parse(serialized);
}

serializingLocalStorage.removeItem = function(key){
  return localStorage.removeItem(key);
}

serializingLocalStorage.clear = function(){
  localStorage.clear();
}

if(typeof(module) !== 'undefined'){
  module.exports = serializingLocalStorage;
}
