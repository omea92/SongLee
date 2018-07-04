var express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser');

// mysql 연결
var mysql = require('mysql');
var connection = mysql.createConnection(require('./config/dbconfig.js'));
var app = express();

app.use(bodyParser.urlencoded({
  extended : false
}));

app.use(bodyParser.json());

connection.connect(function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('mysql connect completed');
});

//app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));

//수정
app.get('/', function(req, res) {
  res.render('index');
});

//MYPAGE////////////////////////////////////////////////////////
app.get('/mypage', function(req, res) {
  var sql = 'SELECT * FROM USER';
  connection.query(sql, function(err, results, fields) {
    res.render('mypage/mypage', {
      layout: false,
      results: results
    });
  });
});

//SEARCH///////////////////////////////////////////////////////
app.post('/search', function(req, res) {
  var sql = ' SELECT * FROM BOOK WHERE ' + req.body.search + '=' + req.body.searchContent;
  connection.query(sql, function(err, results, fields){
    res.render('search', {
      layout: false,
      search_results: results
    });
  });
});
app.get('/admin', function(req, res){
  res.render('admin/admin');
});

//ADMIN//////////////////////////////////////////////////////////////


app.get('/admin', function(req, res) {
  res.render('admin');
});
app.get('/login', function(req, res) {
  res.render('login');
});
app.get('/join', function(req, res) {
  res.render('join');
});

app.listen(3000, function() {
  console.log('Connected 3000 port!');
});
