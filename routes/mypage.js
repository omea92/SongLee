module.exports = function(connection) {
  var express = require('express');
  var mysql = require('mysql');
  var moment = require('moment');
  var bodyParser = require('body-parser');
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

  route.get('/reservation_list', function(req, res) {
    var user_id = 'dpthf403';
    var sql = 'select * from book b, reservation r where b.book_id = r.book_id and b.sequence = r.sequence and r.user_id = ?;';
    var params = [user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields) {
      res.render('mypage/reservation_list', {
        layout: false,
        reservation_results: results,
        moment
      });
    });
  });

  route.get('/delete_reservation', function(req, res){
    var user_id = 'dpthf403';
    var book_id = req.query.book_id;
    var sequence = req.query.sequence;
    var sql = 'delete from reservation where user_id = ? and book_id = ? and sequence = ?';
    var params = [user_id, book_id, sequence];
    sql = mysql.format(sql, params);
    console.log(sql);
    connection.query(sql, function(err, results, fields){
      if(err){
        throw err;
      } else {
        res.redirect('/mypage/reservation_list');
      }
    });
  });

  route.get('/wish_book_list', function(req, res) {
    var user_id = 'dpthf403';
    var sql = ' SELECT wish_no, wish_content, left(wish_content, 10) as cut_content, user_id FROM wish_book WHERE user_id = ?';
    var params = [user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields) {
      console.log(results);
      res.render('mypage/wish_book_list', {
        layout: false,
        wish_results: results
      });
    });
  });

  route.get('/delete_wish_list', function(req, res){
    var wish_no = req.query.wish_no;
    var sql = 'delete from wish_book where wish_no = ?';
    var params = [wish_no];
    sql = mysql.format(sql, params);
    console.log(sql);
    connection.query(sql, function(err, results, fields){
      if(err){
        throw err;
      } else {
        res.redirect('/mypage/wish_book_list');
      }
    });
  });

  route.get('/interest_book_list', function(req, res) {
    var user_id = 'dpthf403';
    var sql = 'select * from book b, interest_book i where b.book_id = i.book_id and b.sequence = i.sequence and i.user_id = ?;';
    var params = [user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields) {
      if(err){
        throw err;
      }
      res.render('mypage/interest_book_list', {
        layout: false,
        interest_results: results,
        moment
      });
    });
  });

  route.get('/user_history', function(req, res){
    var user_id = 'dpthf403';
    var sql = 'select * from book b, user_history u where b.book_id = u.book_id and b.sequence = u.sequence and u.user_id = ?;';
    var params = [user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields){
      res.render('mypage/user_history',{
        layout: false,
        history_results: results,
        moment
      });
    });
  });

  route.get('/my_info_update_form', function(req, res){
    var user_id = 'dpthf403';
    var sql = 'select user_id, password, name, date_format(birthdate, "%Y-%m-%d") birthdate, gender, email from user where user_id = ?';
    var params = [user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields){
      if(err){
        throw err;
      }
      res.render('mypage/my_info_update_form', {
        layout: false,
        my_info: results
      });
    });
  });

  route.get('/user_delete', function(req, res) {
    var sql = 'UPDATE user SET type = "N", password = null, name = null, birthdate = null, email = null, gender = null WHERE user_id = ?';
    var id = 'dpthf403';
    console.log(id);
    sql = mysql.format(sql, id);
    console.log(sql);
    connection.query(sql, function(err, results, fields) {
      if (err)
        throw err;
      else
        console.log('탈퇴 성공');
      res.redirect('/');
    });
  });

  route.post('/user_update', function(req, res){
    var user_id = req.body.user_id;
    var password = req.body.password;
    var name = req.body.name;
    var birthdate = req.body.birthdate;
    var email = req.body.email;
    var gender = req.body.gender;
    var sql = 'UPDATE user SET password = ?, name = ?, birthdate = ?, email = ?, gender = ? WHERE user_id = ?';
    var params = [password, name, birthdate, email, gender, user_id];

    sql = mysql.format(sql, params);

    connection.query(sql, function(err, results, fields){
      if(err){
        throw err;
      } else {
        console.log('정보 수정 성공');
        res.render('mypage/my_info_update', {
          user_id: user_id
        });
      }
    });
  });

  return route;
};
