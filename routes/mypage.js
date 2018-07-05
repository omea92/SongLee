module.exports = function(connection) {
  var express = require('express');
  var mysql = require('mysql');
  var route = express.Router();
  route.get('/interest_list', function(req, res) {
    var sql = 'SELECT * FROM USER';
    connection.query(sql, function(err, results, fields) {
      res.render('mypage/interest_list', {
        layout: false,
        results: results
      });
    });
  });

  route.get('/reservation', function(req, res) {
    var book_id = req.query.book_id;
    var sequence = req.query.sequence;
    var user_id = 'dpthf403';
    var sql = 'SELECT return_date FROM borrow WHERE book_id = ? and sequence = ? and user_id = ? ;'
    var params = [book_id, sequence, user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields){
        var result = JSON.stringify(results);
        if(err) {
          throw err;
        } else {
          var strArray = result.split('"'); // "기준으로 잘라서 strArray에 배열형태로 넣음
          var return_date = strArray[3];
          return_date = return_date.substring(0, 10);
          var sql2 = 'INSERT INTO reservation VALUES (?, ?, ?, ?)';
          var params = [book_id, sequence, user_id, return_date];
          sql2 = mysql.format(sql2, params);
          console.log(sql2);
          connection.query(sql2, function(err, results, fields){
              if(err){
                throw(err);
              }
              res.render('mypage/reservation');
          });
        }
    });
  });

  route.get('/wish_book_list', function(req, res) {
    var sql = 'SELECT * FROM USER';
    connection.query(sql, function(err, results, fields) {
      res.render('mypage/wish_book_list', {
        layout: false,
        results: results
      });
    });
  });
  return route;
};
