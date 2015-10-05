
serializingLocalStorage.clear();

var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

// think about a way to save updates that don't get sent
var syncList = function(){
  var obj = {};

  var identity = localStorage.getItem('identity');
  if(identity === null){
    identity = "Player-"+butt_uid();
    localStorage.setItem('identity', identity);
  }

  console.log("Emitting ", identity);
  socket.emit("GUID", identity);

  var hash_list = serializingLocalStorage.getItem('hash_list');
  if(hash_list === null){
    console.log("No hash list found.");
    hash_list = {};
  }

  var cache = {};
  var cache_size = 5;
  var keys = [];
  var setCache = function(key, value){
    keys.unshift(key);
    if(keys.length > cache_size){
      delete cache[keys.pop()];
    }
    cache[key] = value;
  };
  var removeFromCache = function(key){
    if(key in cache){
      delete cache[key];
    }
  }

  var already_ready = false;
  var ready_callbacks = [];
  obj.ready = function(callback){
    verify(callback);
    if(already_ready){
      callback();
    }
    else{
      ready_callbacks.push(callback);
    }
  };

  var bindings = {};
  obj.bind = function(key, callback){
    verify(key, callback);
    if(!key in bindings || typeof(bindings[key]) === 'undefined'){
      bindings[key] = [];
    }
    bindings[key].push(callback);
  };
  obj.clearBindings = function(key){
    verify(key);
    bindings[key] = [];
  };

  obj.diff = function(){
    console.log("Emitting DIFF", data_list);
    socket.emit("DIFF", data_list);
  };
  obj.request = function(key){
    verify(key);
    socket.emit("REQUEST", key);
  };
  obj.setItem = function(key, data){
    verify(key, data);
    var new_hash = murmurhash(data);
    var old_hash = hash_list[key];
    if(new_hash === old_hash){
      return;
    }
    hash_list[key] = new_hash;
    setCache(key, data);
    serializingLocalStorage.setItem('hash_list', hash_list);
    serializingLocalStorage.setItem(key, data);
    if(typeof(bindings[key]) !== 'undefined'){
      _.forEach(bindings[key], function(binding){
        binding(data);
      });
    }
  };
  obj.syncItem = function(key, data){
    obj.setItem(key, data);
    socket.emit("UPDATE", key, data);
  }
  obj.getItem = function(key){
    verify(key);
    if(key in cache){
      return cache[key];
    }
    var item = serializingLocalStorage.getItem(key);
    if(item !== null){
      return item;
    }
    else{
      console.warn("Key not found, trying server: ", key);
      obj.request(key);
      return null;
    }
  };
  obj.dump = function(){
    console.group("Sync Database Dump");
    console.log("----Hash List----");
    console.log(hash_list);
    console.log("----Datas----");
    var keys = _.keys(hash_list);
    _.forEach(keys, function(key){
      var item = serializingLocalStorage.getItem(key);
      console.log(key, item);
    });
    console.log("----Cache----");
    console.log(cache);
    console.groupEnd();
  };

  socket.on("UPDATE", function(key, data){
    console.log("Received Update", key, data);
    obj.setItem(key, JSON.parse(data));
  });
  socket.on("REMOVE", function(key){
    console.log("Remove", key);
    obj.clearBindings(key);
    serializingLocalStorage.removeItem(key);
    removeFromCache(key);
  });
  socket.on("WELCOME", function(msg){
    console.log("Welcome", msg);
    _.forEach(ready_callbacks, function(callback){
      callback();
    });
  });

  return obj;
};

var butts = syncList();
butts.ready(function(){
  butts.syncItem('one', 'two');
  butts.syncItem('three', {});
  butts.syncItem('four', 4);
  butts.syncItem('five', {'six':7});
  butts.syncItem('eight', 9);
  butts.syncItem('ten', 10);
  butts.dump();
});

butts.bind('list_of_connections', function(list_of_connections){
  console.log("List of connections!", list_of_connections);
});
