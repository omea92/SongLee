//회원가입 및 로그인 정원준/////////////////////////////////////////////////
module.exports = function(connection) {
  var express = require('express');
  var crypto = require('crypto');
  var route = express.Router();
  var fs = require('fs');
  var mysql = require('mysql');
  var bodyParser = require('body-parser');

  route.use(bodyParser.urlencoded({extended: false}));

  route.get('/join', function(req, res) {
    fs.readFile('./views/join.ejs', 'utf8', function(err, data) {
      res.send(data);
    });
  });

    route.get('/loginForm', function(req, res){
      fs.readFile('./views/login/loginForm.ejs', 'utf8', function(err, data) {
        res.send(data);
      });
    });

    route.post('/login', function(req, res) {
      var paramId = req.body.user_id;
      var paramPassword = req.body.password;
      // var sql = "select * from user where user_id=?";
      // connection.query(sql, [paramId], function(err, results) {
      //   if(err) {
      //     console.log(err);
      //   }
      //   if(!results[0]) {
      //     return res.send('아이디가 불일치 합니다.');
      //   }
      // });
      var user = {
        paramId : req.body.user_id,
        paramPassword : req.body.password
      };
      var sql = 'select user_id from user where user_id = ?';
      //var sql2 = 'select password from user where password = ?';
      var params = [paramId, paramPassword];
      sql = mysql.format(sql, params[0]);
      connection.query(sql, user, function(err, results) {
        //JSON.stringify(results); -> json문자열
        var result = JSON.stringify(results);
        var final = result.substring(13, 20);
        // if(req.session.user_id) {
        //   res.send(user_id + '님 로그인 성공');
        //   res.redirect('/');
        // } else {
        //   res.send('<script>alert("세션 저장하세요.."); history.back();</script>');
        // }
        // if(final == params[0]){
        //   res.send('<script>alert("환영합니다!"); location.href="/";</script>');
        // } else {
        //   res.send('<script>alert("아이디나 비밀번호가 틀려서 되돌아 갑니다!"); history.back();</script>');
        //   res.render('/loginForm');
        // }
      });

      //로그인 해결책 참조//////////////////////////////////////////////////////
      // connection.query(sql, function(err, results, fields) {
      // var result = JSON.stringify(results);
      // if (err) {
      //   throw err;
      // } else {
      //   var strArray = result.split('"'); // "기준으로 잘라서 strArray에 배열형태로 넣음
      //   var return_date = strArray[3];
      //   console.log(return_date);
      //   console.log(typeof(return_date));
      //   return_date = return_date.substring(0, 10);
      //   var sql2 = 'INSERT INTO reservation VALUES (?, ?, ?, ?);';
      //   var params = [book_id, sequence, user_id, return_date];
      //   sql2 = mysql.format(sql2, params);
      //   connection.query(sql2, function(err, results, fields) {
      //     res.render('book/reservation', {
      //       results: results
      //     });
      //   });
      // }
      //로그인 해결책 참조//////////////////////////////////////////////////////

      // connection.query('select count(*) user_id from user where user_id = ? and password = ?', [paramId, paramPassword], function(err, rows) {
      // if(err) console.err('err', err);
      // console.log('rows', rows);
      //
      // var id = rows[0].user_id;
      // if(id == 1) {
      //   req.session.user_id = paramId;
      //   res.redirect('/');
      // } else {
      //   res.send('<script>alert("아이디나 비밀번호가 틀려서 되돌아 갑니다!"); history.back();</script>');
      // }
    });
      // if(paramId != "" && paramPassword != "") {
      //   console.log(paramId);
      //   res.redirect('/');
      // } else {
      //   res.send('<a href="/user/loginForm">로그인</a>');
      // }

    route.post('/join', function(req, res) {
      var body = req.body;
      var user_id = req.body.user_id;
      var password = req.body.password;
      var name = req.body.name;
      var birthdate = req.body.birthdate;
      var gender = req.body.gender;
      var email = req.body.email;

      var sql = 'insert into user (user_id, password, name, birthdate, gender, email) value (?, ?, ?, ?, ?, ?)';
      var sql_id = 'insert into user values(?)';
      var params = [user_id, password, name, birthdate, gender, email];

      sql = mysql.format(sql, params);
      connection.query(sql, function(err) {
        if(err){
          throw err;
        }
        res.redirect('/');
      });

      sql_id = mysql.format(sql_id, params);
      connection.query(sql_id, function(err, results) {
        if(err) {
          console.log(err);
        } else {
          req.session.user_id = user_id;
          req.session.save(function() {
            console.log(req.session.user_id);
            res.send('<script>alert("환영합니다!"); location.href="/";</script>');
            res.redirect('/');
          });
        }
      });
    });

    //세션데이터 삭제 하여 로그아웃
    route.get('/logout', function(req, res) {
      req.session.destroy(function(err) {
        if(err) console.err('err', err);
        res.send('<script>alert("로그아웃 되었습니다!"); location.href="/";</script>');
      });
      // req.session.destroy();
      // req.session.save(function() {
      //   res.render('/'); //로그아웃 후 index
      // });
    });

    // route.get('/list', function(req, res) {
    //   var sql = ' select user_id, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email, type ' + ' from user';
    //   sql = mysql.format(sql);
    //   console.log(sql);
    //   connection.query(sql, function(err, results, fields) {
    //     console.log(results);
    //     res.render('admin/userList', {
    //       layout: false,
    //       users: results
    //     });
    //   });
    // });

  return route;
};
