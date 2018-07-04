module.exports = function(connection){
  var express = require('express');
  var route = express.Router();
  var mysql = require('mysql');

  route.get('/list', function(req, res){
    var sql = ' select user_id, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email, type ' + ' from user';
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

  route.get('/userdetail', function(req, res){
    var sql = ' ';
  })

  return route;
};
