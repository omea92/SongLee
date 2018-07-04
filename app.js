var express = require('express'),
    http = require('http');
var mysql = require('mysql');
var dbconfig = require('./config/dbconfig.js');
var connection = mysql.createConnection(dbconfig);

var app = express();
//app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));

connection.connect();

//수정
app.get('/', function(req, res){
  res.render('index');
});

app.get('/mypage', function(req, res){
  res.render('mypage/mypage');
});

app.get('/admin', function(req, res){
  res.render('admin/admin');
});

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

//MYPAGE/////////////////////////////////////////////////////////////
//ADMIN//////////////////////////////////////////////////////////////


app.get('/admin', function(req, res){
  res.render('admin');
})
app.get('/login', function(req, res){
  res.render('login');
})
app.get('/join', function(req, res){
  res.render('join');
})

app.listen(3000, function(){
  console.log('Connected 3000 port!');
});
