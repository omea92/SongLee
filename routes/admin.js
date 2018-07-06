module.exports = function(connection) {
  var express = require('express');
  var route = express.Router();
  var mysql = require('mysql');

  route.get('/', function(req, res) {
    res.render('book/borrowForm');
  });

  route.get('/user_list', function(req, res) {
    var sql = ' select user_id, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email, type ' +
      ' from user';
    sql = mysql.format(sql);
    console.log(sql);
    connection.query(sql, function(err, results, fields) {
      console.log(results);
      res.render('admin/userList', {
        layout: false,
        users: results
      });
    });
  });

  route.get('/user_detail', function(req, res) {
    var sql = ' select user_id, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email, type ' +
      ' from user ' +
      ' where user_id = ?';
    var id = req.query.user_id;
    console.log(id);
    sql = mysql.format(sql, id);
    console.log(sql);
    connection.query(sql, function(err, data, fields) {
      console.log(data);
      res.render('admin/userDetail', {
        layout: false,
        user: data[0]
      });
    });
  });

  route.post('/user_update', function(req, res){
    var user_id = req.body.user_id;
    var password = req.body.password;
    var name = req.body.name;
    var birthdate = req.body.birthdate;
    var email = req.body.email;
    var gender = req.body.gender;
    var type = req.body.type;
    var sql = 'UPDATE user SET name = ?, birthdate = ?, email = ?, gender = ?, type = ? WHERE user_id = ?';
    var params = [name, birthdate, email, gender, type, user_id];

    sql = mysql.format(sql, params);
    console.log(sql);

    connection.query(sql, function(err, results, fields){
      if(err){
        throw err;
      } else {
        console.log('정보 수정 성공');
        res.redirect('/admin/user_list');
      }
    });
  });

  route.get('/user_delete', function(req, res){
    var sql = 'UPDATE user SET type = "N", password = null, name = null, birthdate = null, gender = null, email = null WHERE user_id = ?';

    var id = req.query.user_id;
    console.log(id);
    sql = mysql.format(sql, id);
    console.log(sql);
    connection.query(sql, function(err, data, fields) {
      if (err)
        throw err;
      else
        console.log('delete user 성공');
      res.redirect('/admin/user_list');
    });
  });
  return route;
};
