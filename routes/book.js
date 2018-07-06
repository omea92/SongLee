module.exports = function(connection) {
  var express = require('express');
  var route = express.Router();
  var moment = require('moment');
  var mysql = require('mysql');

  route.post('/search', function(req, res) {
    var search = req.body.search;
    var searchContent = '%' + req.body.searchContent + '%';
    var sql;
    if (search == 'title') {
      sql = 'SELECT * FROM BOOK WHERE title like ? ';
    } else if (search == 'author') {
      sql = 'SELECT * FROM BOOK WHERE author like ? ';
    } else if (search == 'publish_date') {
      sql = 'SELECT * FROM BOOK WHERE publish_date like ? ';
    }
    var params = [searchContent];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields) {
      res.render('book/search_result', {
        layout: false,
        search_results: results,
        moment
      });
    });
  });

  route.get('/list', function(req, res) {
    var sql = ' select book_id, title, publisher, author, subject, date_format(publish_date, "%Y-%m-%d") publish_date, status, sequence ' +
      ' from book order by title asc';
    sql = mysql.format(sql);
    connection.query(sql, function(err, results, fields) {
      res.render('admin/bookManage', {
        layout: false,
        books: results
      });
    });
  });

  route.get('/detail', function(req, res) {
    var book_id = req.query.book_id;
    var sequence = req.query.sequence;
    var sql = 'SELECT * FROM BOOK WHERE book_id = ? AND sequence = ?';
    var params = [book_id, sequence];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields) {
      res.render('book/book_detail', {
        layout: false,
        book_detail: results[0],
        moment
      });
    });
  });

  route.get('/create_book_form', function(req, res) {
    res.render('book/createBookForm');
  });

  route.post('/create', function(req, res) {
    var bood_id = req.body.bood_id;
    var title = req.body.title;
    var publisher = req.body.publisher;
    var author = req.body.author;
    var subject = req.body.subjet;
    var publish_date = req.body.publish_date;
    var param = [bood_id, title, publisher, author, subject, publish_date];
    var sql = ' INSERT INTO book(book_id, title, publisher, author, subject, publish_date, sequence) ' +
      ' VALUES (?,?,?,?,?,?,1) ';

    sql = mysql.format(sql, param);
    connection.query(sql, param, function(err) {
      if (err)
        throw err;
      else
        res.redirect('/book/list');
    });
  });

  route.get('/wish_book_form', function(req, res){
    res.render('book/wish_book_form');
  });

  route.get('/wish_book', function(req, res){
    var wish_content = req.query.wish_content;
    var user_id = 'dpthf403';
    var sql = 'INSERT INTO wish_book (wish_content, user_id) VALUES (?, ?)';
    var params = [wish_content, user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err){
      if(err){
        throw err;
      } else {
        res.redirect('/mypage/wish_book_list');
      }
    });
  });

  route.get('/interest_book', function(req, res){
    var book_id = req.query.book_id;
    var sequence = req.query.sequence;
    var user_id = 'dpthf403';
    var sql = 'INSERT INTO interest_book VALUES (?, ?, ?)';
    var params = [book_id, sequence, user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields){
      res.render('book/interest_book', {
        results: results
      });
    });
  });

  route.get('/reservation', function(req, res) {
    var book_id = req.query.book_id;
    var sequence = req.query.sequence;
    var user_id = 'dpthf403';
    var sql = 'SELECT return_date FROM borrow WHERE book_id = ? and sequence = ? and user_id = ? ;';
    var params = [book_id, sequence, user_id];
    sql = mysql.format(sql, params);
    connection.query(sql, function(err, results, fields) {
      var result = JSON.stringify(results);
      if (err) {
        throw err;
      } else {
        var strArray = result.split('"'); // "기준으로 잘라서 strArray에 배열형태로 넣음
        var return_date = strArray[3];
        console.log(return_date);
        console.log(typeof(return_date));
        return_date = return_date.substring(0, 10);
        var sql2 = 'INSERT INTO reservation VALUES (?, ?, ?, ?);';
        var params = [book_id, sequence, user_id, return_date];
        sql2 = mysql.format(sql2, params);
        connection.query(sql2, function(err, results, fields) {
          res.render('book/reservation', {
            results: results
          });
        });
      }
    });
  });

  return route;
};
