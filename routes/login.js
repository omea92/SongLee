//로그인//////////////////////////////////////////////
module.exports = function(session, connection) {
  var express = require('express');
  var passport = require('passport');
  var LocalStrategy = require('passport-local');
  var route = express.Router();
  var mysql = require('mysql');

  //가입 시 세션에 회원 정보 저장 -> 성공 시 index로 이동
  route.post('/user/join', function(req, res) {
    var user = {
      user_id : req.body.user_id,
      password : req.body.password
    };
    var sql = 'insert into user (user_id, password, name, birthdate, gender, email) value (?, ?, ?, ?, ?, ?)';
    connection.query(sql, user, function(err, results) {
      if(err) {
        console.log(err);
      } else {
        req.session.user_id = req.body.user_id;
        req.session.save(function() {
          res.redirect('/');
        });
      }
    });
  });

  //세션 저장 여부에 따른 로그인 결정
  route.get('/', function(req, res) {
    if(req.session.user_id) {
      res.send(user_id + '님 로그인 되었습니다.');
    } else {
      res.send('로그인 하세요!');
    }
  });

  //세션데이터 삭제 하여 로그아웃
  route.get('/logout', function(req, res) {
    delete req.session.user_id;
    req.session.save(function() {
      res.redirect('/'); //로그아웃 후 index
    });
  });

  // //세션 등록
  // route.use(session({
  //   secret: '12312dajfj23rj2po4$#%@#',
  //   resave: false,
  //   saveUninitialized: true,
  //   store: new MySQLStore(connection)
  // }));
  //
  // //패스포트 인증 등록
  // route.use(passport.initialize());
  // route.use(passport.session());
  //
  // //패스포트 회원 인증
  // passport.use(new LocalStrategy(
  //   function(user_id, password, done) {
  //     var paramId = user_id; //post로 받은 값을 가져옴
  //     var paramPassword = password;
  //
  //     var sql = "select * from user where user_id=?";
  //
  //   }
  // ));
  //
  // //세션 로그아웃
  // route.get('/logout', function(req, res) {
  //   req.logout(); //패스포트에서 제공
  //   //세션 잘끝나면 index.ejs로 이동
  //   req.session.save(function() {
  //     res.redirect('/');
  //   });
  // });
  //
  // route.get('/', function(req, res) {
  //   console.log('회원님을 환영합니다!');
  //   if(req.user && req.user.user_id) {
  //     res.redirect('/');
  //   } else {
  //     res.send('/login');
  //   }
  // });
  //
  // route.get('/count', function(req, res) {
  //   if(req.session.count) {
  //     req.session.count++;
  //   } else {
  //     req.session.count = 1; //세션 생성
  //   }
  //   res.send('count : ' + req.session.count);
  // });

  return route;
};
