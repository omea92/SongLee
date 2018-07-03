var express = require('express'),
    http = require('http');
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));



app.get('/', function(req, res){
  res.render('index');
});

app.get('/mypage', function(req, res){
  res.render('mypage');
})

app.listen(3000, function(){
  console.log('Connected 3000 port!')
});
