var express = require('express'),
  http = require('http'),
  moment = require('moment'),
  bodyParser = require('body-parser');

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

var mypage = require('./routes/mypage')(connection);
app.use('/mypage', mypage);
app.use(bodyParser.urlencoded({
  extended : false
}));

app.use(bodyParser.json());


var app = express();
//app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));

//수정
app.get('/', function(req, res) {
  res.render('index');
});



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

          app.get('/bookManage', function(req, res){
            var sql = ' select book_id, title, publisher, author, subject, date_format(publish_date, "%Y-%m-%d") publish_date, status, sequence '
                      + ' from book order by title asc';
            sql = mysql.format(sql);
            console.log(sql);
            connection.query(sql, function(err, results, fields){
              console.log(results);
              res.render('admin/bookManage',{
                layout:false,
                books : results
              });
            });
          });

          app.get('/userManage', function(req, res){
            var sql = ' select user_id, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email, type '
                    + ' from user';
            sql = mysql.format(sql);
            console.log(sql);
            connection.query(sql, function(err, results, fields){
              console.log(results);
              res.render('admin/userManage',{
                layout:false,
                users : results
              });
            });
          });

          app.get('/userdetail', function(req, res){
            var sql = ' ';
          })

          app.get('/test', function(req, res){
            res.render('test', {
                      title: "MY HOMEPAGE",
                      length: 5
        });
    });
});

//ADMIN//////////////////////////////////////////////////////////////
app.get('/admin', function(req, res){
  res.render('admin/admin');
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
