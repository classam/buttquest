
serializingLocalStorage.clear();




var identity = localStorage.getItem('identity');
if(identity === null){
  identity = "Player-"+butt_uid();
  localStorage.setItem('identity', identity);
}


var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});


console.log("Emitting ", identity);
socket.emit("GUID", identity);

socket.on("WELCOME", function(msg){
  console.log("Welcome", msg);
});

// think about a way to save updates that don't get sent
var syncList = function(){
  var hash_list = serializingLocalStorage.getItem('hash_list');
  if(hash_list === null){
    console.log("No hash list found.");
    hash_list = {};
  }

  var diff = function(){
    console.log("Emitting DIFF", data_list);
    socket.emit("DIFF", data_list);
  };
  var request = function(key){

  };
  var update = function(key, data){
    var new_hash = murmurhash(data);
    hash_list[key] = new_hash;
    serializingLocalStorage.setItem('hash_list', hash_list);
    serializingLocalStorage.setItem(key, data);
    socket.emit("UPDATE", key, data);
  };
  var getItem = function(key){
    var hash = hash_list[key];
    return serializingLocalStorage.getItem(key+'.'+hash, data);
  }

};
