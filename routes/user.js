//회원가입 정원준/////////////////////////////////////////////////
module.exports = function(connection) {
  var express = require('express');
  var route = express.Router();
  var fs = require('fs');
  var mysql = require('mysql');
  route.get('/join', function(req, res) {
    fs.readFile('./views/join.ejs', 'utf8', function(err, data) {
      res.send(data);
    });
  });
  // route.post('/join', function(req, res) {
  //   var body = req.body;
  //   console.log(req.body.user_id);
  //   var user_id = req.body.user_id;
  //   var password = req.body.password;
  //   var name = req.body.name;
  //   var birthdate = req.body.birthdate;
  //   var gender = req.body.gender;
  //   var email = req.body.email;
  //   var sql = 'insert into user (user_id, password, name, birthdate, gender, email) value (?, ?, ?, ?, ?, ?)';
  //   var params = [user_id, password, name, birthdate, gender, email];
  //
  // route.get('/list', function(req, res){
  //   var sql = ' select user_id, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email, type ' + ' from user';
  //   sql = mysql.format(sql);
  //   console.log(sql);
  //   connection.query(sql, function(err, results, fields){
  //     console.log(results);
  //     res.render('admin/userList',{
  //       layout:false,
  //       users : results
  //     });
  //   });
  // });
  //
  // route.get('/userdetail', function(req, res){
  //   var sql = ' ';
  // });

  return route;
// });
};
