var http = require('http'),
express = require('express');

// Express 미들웨어
var bodyParser = require('body-parser'),
			stat = require('serve-static');
// Express 객체 생성
var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱!
app.use(bodyParser.urlencoded({
	extended : false
}));

// body-parser 를 사용해 application/json 파싱
app.use(bodyParser.json());

//미들웨어에서 파라미터 확인!
app.use(function(req, res, next) {
	console.log('미들웨어에서 요청 처리!');

	// GET -> query		POST -> body
	var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;

	res.writeHead('200', {
		"Content-Type" : "text/html; charset=utf-8"
	});

	res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
	res.write('<div><p>Param Id : ' + paramId + '</p></div>');
	res.write('<div><p>Param Password : ' + paramPassword + '</p></div>');
	res.end();
});

var server = http.createServer(); // webserver객체 리턴

var host = 'localhost';
var port = 3000;
server.listen(port, host, 50000, function(){ // listen(port[, hostname][, backlog][, callback]) 서버를 실행하여 대기시킴
    console.log('웹서버가 실행되었습니다.' + host + ':' + port);
});
