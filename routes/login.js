//로그인//////////////////////////////////////////////
module.exports = function(session, connection) {
  var express = require('express');
  var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
  var route = express.Router();
  var fs = require('fs');
  var mysql = require('mysql');
  var path = require('path');
  var Login = require('./login');
  var bodyParser = require('body-parser');

  route.use(bodyParser.urlencoded({extended: false}));
  route.get('/loginForm', function(req, res){
    fs.readFile('./views/login/loginForm.ejs', 'utf8', function(err, data) {
      res.send(data);
    });
  });


  //패스포트 초기화, 세션 적용
  route.use(passport.initialize());
  route.use(passport.session());

  //가입 시 세션에 회원 정보 저장 -> 성공 시 index로 이동
  route.post('/join', function(req, res) {
    var paramId = req.body.user_id;
    var password = req.body.password;
    var sql = 'insert into user (user_id, password, name, birthdate, gender, email) value (?, ?, ?, ?, ?, ?)';
    connection.query(sql, function(err) {
      if(err) {
        console.log(err);
      } else {
        req.session.user_id = paramId;
        req.session.save(function() {
          res.render('/');
        });
      }
    });
  });


  //패스포트 연결 확인
  route.get('/', function(req, res) {
    res.send('Hello Passport');
  });
  module.exports = route;
  return route;
};
