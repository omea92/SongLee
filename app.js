var express = require('express'),
    http = require('http');
var app = express();

//app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));


//수정
app.get('/', function(req, res){
  res.render('index');
});

app.get('/mypage', function(req, res){
  res.render('mypage');
});

app.get('/mypage', function(req, res){
  res.send('afdsfdsasdfdfdfsdfsdf');
});

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
  console.log('Connected 3000 port!')
});
