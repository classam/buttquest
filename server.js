
var express = require('express')
var nunjucks = require('nunjucks')
var express_app = express()
var http = require('http').Server(express_app);
var io = require('socket.io')(http);

var home_directory = __dirname;
console.log("Home directory: ", home_directory);

nunjucks.configure('views', {
  autoescape: true,
  express   : express_app
});

// Static Content
express_app.use('/media', express.static('./media'));

// Serve it up!
express_app.get('/', function (request, response) {
  response.render('index.html', {
    home_directory: home_directory,
    title : 'Buttquest',
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*
var server = express_app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
*/


module.exports = function(){
}
