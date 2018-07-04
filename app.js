var express = require('express'),
  http = require('http'),
  moment = require('moment'),
  bodyParser = require('body-parser');
  var session = require('express-session');
  var bcrypt = require('bcrypt-nodejs');
  var mysqlSession = require('express-mysql-session')(session);

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

//회원가입//////////////////////

var mypage = require('./routes/mypage')(connection);
app.use('/mypage', mypage);
app.use(bodyParser.urlencoded({
  extended : false
}));

app.use(bodyParser.json());

//회원가입 (정원준)
var user = require('./routes/user')(connection);
app.use('/user', user);

//로그인
var login = require('./routes/login')(connection);
app.use('/login', login);

//app.engine('ejs', require('ejs').renderFile);
app.set('views', __dirname + '/views');
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
app.get('/login', function(req, res) {
  res.render('login');
});

var mypage = require('./routes/mypage')(connection);
var book = require('./routes/book')(connection);
var admin = require('./routes/admin')(connection);
var user = require('./routes/user')(connection);


// //MYPAGE////////////////////////////////////////////////////////
// app.get('/mypage/mypage', function(req, res) {
//   var sql = 'SELECT * FROM USER';
//   connection.query(sql, function(err, results, fields) {
//     res.render('mypage/mypage', {
//       layout: false,
//       results: results
//     });
//   });
// });

//SEARCH///////////////////////////////////////////////////////
app.post('/search', function(req, res) {
  var search = req.body.search;
  var searchContent = '%' + req.body.searchContent + '%';
  var sql;
  if(search == 'title'){
    sql = 'SELECT * FROM BOOK WHERE title like ? ';
  } else if(search == 'author'){
    sql = 'SELECT * FROM BOOK WHERE author like ? ';
  } else if(search == 'publish_date'){
    sql = 'SELECT * FROM BOOK WHERE publish_date like ? ';
  }
  var params = [searchContent];
  sql = mysql.format(sql, params);
  connection.query(sql, function(err, results, fields){
    res.render('book/search_result', {
      layout: false,
      search_results: results,
      moment
    });
  });
});

//BOOK_DETAIL////////////////////////////////////////////////////////
app.get('/book_detail', function(req, res){
    var book_id = req.query.book_id;
    var sequence = req.query.sequence;
    var sql = 'SELECT * FROM BOOK WHERE book_id = ? AND sequence = ?';
    var params = [book_id, sequence];
    sql = mysql.format(sql, params);
    console.log(sql);
    connection.query(sql, function(err, results, fields){
      console.log(results);
        res.render('book/book_detail', {
          layout: false,
          book_detail: results[0],
          moment
        });
    });
});

//ADMIN//////////////////////////////////////////////////////////////
app.use('/admin', admin);
app.use('/user', user);
app.use('/mypage', mypage);
app.use('/book', book);

app.listen(3000, function() {
  console.log('Connected 3000 port!');
});


//회원가입////////////////////////////////////////////////////////
