
var express = require('express')
var express_app = express()

// Serve it up!
express_app.get('/', function (request, response) {
    response.send('Hello World!');
});

var server = express_app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

module.exports = function(){
}
