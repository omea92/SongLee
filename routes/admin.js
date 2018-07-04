module.exports = function(connection){
  var express = require('express');
  var route = express.Router();
  var mysql = require('mysql');

  route.get('/', function(req, res){
    res.render('admin/admin');
  });

  route.get('/user_list', function(req, res){
    var sql = ' select user_id, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email, type '
            + ' from user';
    sql = mysql.format(sql);
    console.log(sql);
    connection.query(sql, function(err, results, fields){
      console.log(results);
      res.render('admin/userList',{
        layout:false,
        users : results
      });
    });
  });

  route.get('/user_detail', function(req, res){
    var sql = ' select user_id, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email, type '
            + ' from user '
            + ' where user_id = ?';
    var id = req.query.user_id;
    console.log(id);
    sql = mysql.format(sql, id);
    console.log(sql);
    connection.query(sql, function(err, data, fields){
      console.log(data);
      res.render('admin/userDetail',{
        layout : false,
        user : data[0]
      });
    });
  });

  route.get('/user_delete', function(req, res){
    var sql = ' delete from user '
            + ' where user_id = ?';
    var id = req.query.user_id;
    console.log(id);
    sql = mysql.format(sql, id);
    console.log(sql);
    connection.query(sql, function(err, data, fields){
      if(err)
        throw err;
      else
        console.log('delete user 성공')
        res.redirect('/admin/user_list')
    });
  });
  return route;
};
