
var express = require('express')
var nunjucks = require('nunjucks')
var express_app = express()
var http = require('http').Server(express_app);
var io = require('socket.io')(http);
var colors = require('colors');


function check(name, variable){
  if(typeof(variable) === 'undefined'){
    console.error(name.red, "not defined!")
  }
  else{
    console.log(name.green, ":", variable);
  }
}

module.exports = exports = function(options){
  /*
   * Options:
   * ip: this server's IP address
   * port: which port to serve HTTP content on
   * home_directory: the root directory of all content
   */

  check('IP Address', options['ip'])
  check('Port', options['port'])
  check('Home Directory', options['home_directory'])

  nunjucks.configure('views', {
    autoescape: true,
    express   : express_app
  });

  // Static Content
  express_app.use('/media', express.static('./media'));

  // Serve it up!
  express_app.get('/', function (request, response) {
    response.render('index.html', {
      home_directory: options['home_directory'],
      ip: options['ip'],
      port: options['port'],
      title : 'Buttquest',
    });
  });

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });
  });

  http.listen(options['port'], function(){
    console.log('listening on *:', options['port']);
  });
}
