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
    var sql = ' insert into book(book_id, title, publisher, author, subject, publish_date, sequence) ' +
      ' values (?,?,?,?,?,?,1) ';

    sql = mysql.format(sql, param);
    connection.query(sql, param, function(err) {
      if (err)
        throw err;
      else
        res.redirect('/book/list');
    });
  });

  return route;
};
