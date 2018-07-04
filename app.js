var express = require('express'),
    http = require('http');
    var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var mysqlSession = require('express-mysql-session')(session);


//app.engine('ejs', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

//세션///////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret : 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
  resave : false,
  saveUninitialized: true,
  store : new mysqlSession({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'bitr33',
    database : '4days'
  })
}));

//세션 확인//////////////////////////////////////////////////
app.get('/count', function(req, res) {
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }

  res.send('count : ' + req.session.count);
});


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

app.get('/test', function(req, res){
  res.render('test', {
            title: "MY HOMEPAGE",
            length: 5
        });
});

//MYPAGE/////////////////////////////////////////////////////////////
//ADMIN//////////////////////////////////////////////////////////////

app.get('/login', function(req, res){
  res.render('login');
})
app.get('/join', function(req, res){
  res.render('join');
})

app.listen(3000, function(){
  console.log('Connected 3000 port!');
});


//회원가입////////////////////////////////////////////////////////
