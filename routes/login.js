//로그인//////////////////////////////////////////////
module.exports = function(connection) {
  var express = require('express');
  var route = express.Router();
  var mysql = require('mysql');

  //세션 등록
  route.use(session({
    secret: '12312dajfj23rj2po4$#%@#',
    resave: false,
    saveUninitialized: true,
    store: new mysqlSession(require('./config/dbconfig'))
  }));

  //패스포트 인증 등록
  route.use(passport.initialize());
  route.use(passport.session());

  //세션 로그아웃
  route.get('/logout', function(req, res) {
    req.logout(); //패스포트에서 제공
    //세션 잘끝나면 index.ejs로 이동
    req.session.save(function() {
      res.redirect('/');
    });
  });

  route.get('/', function(req, res) {
    console.log('회원님을 환영합니다!');
    if(req.user && req.user.user_id) {
      res.redirect('/');
    } else {
      res.send('/login');
    }
  });

  return route;
};
