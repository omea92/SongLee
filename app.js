var express = require('express'),
    http = require('http'),
    moment = require('moment'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    bcrypt = require('bcrypt-nodejs'),
    MySQLStore = require('express-mysql-session')(session);
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
// mysql 연결
var mysql = require('mysql');
var connection = mysql.createConnection(require('./config/dbconfig'));
var app = express();
//파일 입력 관련 npm 추가 writer:koo
var multipart = require('connect-multiparty');


//정원준 작성 부분////////////////////////////
app.use(bodyParser.urlencoded({extended: false}));
//정원준 작성 부분////////////////////////////


connection.connect(function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('mysql connect completed');
});

//세션 등록//////////////////////////////
var options = {
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'bitr33',
  database : '4days'
};
var sessionStore = new MySQLStore(options);
app.use(session({
  secret: '12sdfwerwersdfserwerwef',
  resave: false,
  saveUninitialized: true,
  store : sessionStore
}));
app.get('/', function(req, res){
  req.session.user_id = paramId;
  console.log(req.session.user_id);
	if(req.session.authId)
		res.send(authId+'님 로그인되었습니다');
	else
		res.send('로그인하세요!');
});


//마이페이지//////////////////////
var mypage = require('./routes/mypage')(connection);
app.use('/mypage', mypage);
app.use(bodyParser.urlencoded({
  extended : false
}));

app.use(bodyParser.json());

//회원가입
var user = require('./routes/user')(connection);
app.use('/user', user);

//로그인
var login = require('./routes/login')(session, connection, passport);
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
app.use(multipart({uploadDir: __dirname + '/public/img'}));

app.get('/', function(req, res) {
  var sql = 'SELECT * FROM book ORDER BY borrow_count DESC LIMIT 1;' + 'SELECT * FROM book WHERE subject = "교육" ORDER BY borrow_count DESC LIMIT 1;' + 'SELECT * FROM book WHERE subject LIKE "%만화" ORDER BY borrow_count DESC LIMIT 1';

  connection.query(sql, function(err, results, fields){
    res.render('index', {
        layout: false,
        ranking: results
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
