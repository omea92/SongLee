//회원가입/////////////////////////////////////////////////
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
  route.post('/join', function(req, res) {
    var body = req.body;
    console.log(req.body.user_id);
    var user_id = req.body.user_id;
    var password = req.body.password;
    var name = req.body.name;
    var birthdate = req.body.birthdate;
    var gender = req.body.gender;
    var email = req.body.email;
    var sql = 'insert into user (user_id, password, name, birthdate, gender, email) value (?, ?, ?, ?, ?, ?)';
    var params = [user_id, password, name, birthdate, gender, email];

    sql = mysql.format(sql, params);
    console.log(sql);
    connection.query(sql, function(err) {
      if(err){
        throw err;
      }
      res.redirect('/');
    });
  });

  return route;
};
