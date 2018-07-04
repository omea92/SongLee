var express = require('express');
var mysql = require('mysql');

var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

var client = mysql.createConnection({
  hostname : "localhost",
  user : 'root',
  password : 'bitr33',
  database : 'node'
});

server.listen(port, function() {
  console.log("Connect Server : " + port);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/test', function(req, res) {
  var username = 'name1';
  client.query('select * from users where name = ?', username, function(err, result1) {
    if(err) throw err;

    var userId = result1[0].id;
    console.log('테스트 : ' + userId);
  });

  res.render('test', {
    userId : userId
  });
});
