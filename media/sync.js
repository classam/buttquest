
localStorage.clear();




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

var syncList = function(){
  var hash_list = {};
  var data_list = {};

  var diff = function(){
    socket.emit("DIFF", data_list);
  };
  var request = function(key){

  };
  var update = function(key, data){

  };

};
