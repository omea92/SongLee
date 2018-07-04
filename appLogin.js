var express = require('express');
var mysql = require('mysql');
var dbconfig = require('./database.js');
var connection = mysql.createConnection(dbconfig);

var app = express();
app.set('port', process.env.PORT || 3000);
app.get('/', function(req, res) {
  res.send('Root');
});
app.get('/user', function(req, res) {
  connection.query('SELECT * from user', function(err, rows) {
    if(err) throw err;

    console.log('결과 : ', rows);
    res.send(rows);
  });
});

app.listen(app.get('port'), function() {
  console.log('서버 실행 중 ' + app.get('port'));
});
