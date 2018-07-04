var express = require('express'),
    http = require('http');
var app = express();

//app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get('/', function(req, res){
  res.render('index');
});

app.get('/mypage', function(req, res){
  res.render('mypage/mypage');
});

app.get('/test', function(req, res){
  res.render('test', {
            title: "MY HOMEPAGE",
            length: 5
        });
});

app.get('/admin', function(req, res){
  res.render('admin');
});

app.listen(3000, function(){
  console.log('Connected 3000 port!');
});
