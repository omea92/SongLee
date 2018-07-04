var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var client = mysql.createConnection(require('./config/dbconfig'));
var app = express();
app.use(bodyParser.urlencoded({
  extended : false
}));

app.listen(3000, function() {
  console.log('서버 가동중...');
});
app.get('/join', function(req, res) {

});
