var express = require('express'),
    http = require('http'),
    moment = require('moment'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    bcrypt = require('bcrypt-nodejs'),
    mysqlSession = require('express-mysql-session')(session);

// mysql 연결
var mysql = require('mysql');
var connection = mysql.createConnection(require('./config/dbconfig'));
var app = express();
connection.connect(function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('mysql connect completed');
});
app.use(bodyParser.json());

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function(req, res) {
  // 분야 별 1위 도서 select하기!
  //  + 'select * from book where subject = "소설" order by borrow_count desc limit 1;';
  var sql = 'SELECT * FROM book ORDER BY borrow_count DESC LIMIT 2;';
  connection.query(sql, function(err, results, fields){
    res.render('index', {
        layout: false,
        ranking: results[0],
        ranking2: results[1]
    });
  });
});

var mypage = require('./routes/mypage')(connection);
var book = require('./routes/book')(connection);
var admin = require('./routes/admin')(connection);
var user = require('./routes/user')(connection);

app.use('/admin', admin);
app.use('/user', user);
app.use('/mypage', mypage);
app.use('/book', book);

app.listen(3000, function() {
  console.log('Connected 3000 port!');
});
