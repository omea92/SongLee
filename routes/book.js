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

  route.get('/wishList', function(req, res) {
    var sql = ' select wish_no, wish_content, user_id from wish_book order by wish_no desc';
    sql = mysql.format(sql);
    console.log(sql);
    connection.query(sql, function(err, results, fields){
      console.log(results);
      res.render('book/wishList', {
        layout:false,
        wishList : results
      })
    })
  });


  route.get('/create_book_form', function(req, res) {
    res.render('book/createBookForm');
  });

  route.get('/borrowForm', function(req, res) {
    res.render('book/borrowForm');
  });

  route.get('/reciveForm', function(req, res) {
    res.render('book/reciveForm');
  });


  route.get('/create_oldbook_form', function(req, res) {
    res.render('book/createOldBookForm')
  });

  route.post('/create', function(req, res) {
    var book_id = req.body.book_id;
    var title = req.body.title;
    var publisher = req.body.publisher;
    var author = req.body.author;
    var subject = req.body.subjet;
    var publish_date = req.body.publish_date;
    var param = [book_id, title, publisher, author, subject, publish_date];
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

  route.get('/select_one_book', function(req, res) {
    var book_id = req.query.book_id;
    console.log(book_id);
    var sql = ' select book_id, title, publisher, author, subject, date_format(publish_date, "%Y-%m-%d") publish_date, sequence ' +
      ' from book ' +
      ' where book_id = ? ' +
      'order by sequence desc ';

    console.log(sql);
    var param = [book_id];
    sql = mysql.format(sql, param);

    connection.query(sql, param, function(err, data) {
      if (err)
        throw err;
      else {
        console.log(data[0]);
        if (!data[0]) {
          console.log(data[0] + 'if');
          res.redirect('/book/create_oldbook_form');
        } else {
          res.render('book/selectOneBook', {
            layout: false,
            book: data[0]
          });
        }
      }
    });
  });

  route.get('/bookSearchInBorrow', function(req, res) {
    var book_id = req.query.book_id;
    var sequence = req.query.sequence;
    var sql = ' select book_id, title, publisher, author, subject, date_format(publish_date, "%Y-%m-%d") publish_date, sequence, status, date_format(date_add(now(), interval + 14 day), "%Y-%m-%d") returnDate' +
      ' from book ' +
      ' where book_id = ? and sequence = ?' +
      'order by sequence desc ';

    console.log(sql);
    var param = [book_id, sequence];
    sql = mysql.format(sql, param);

    connection.query(sql, param, function(err, data) {
      if (err)
        throw err;
      else {
        console.log(data);
        if (!data[0]) { //fail
          res.send({
            result: 'fail'
          });
        } else { //success
          res.send({
            result: 'success',
            book: data[0]
          });
        }
      }
    });
  });

  route.post('/add_oldBook', function(req, res) {
    console.log('add_oldBook');
    var bood_id = req.body.book_id;
    var title = req.body.title;
    var publisher = req.body.publisher;
    var author = req.body.author;
    var subject = req.body.subjet;
    var publish_date = req.body.publish_date;
    var sequence = Number(req.body.sequence) + 1;
    var param = [bood_id, title, publisher, author, subject, publish_date, sequence];
    var sql = ' insert into book(book_id, title, publisher, author, subject, publish_date, sequence) ' +
      ' values (?,?,?,?,?,?,?) ';

    console.log(sql);
    sql = mysql.format(sql, param);
    connection.query(sql, param, function(err) {
      if (err)
        throw err;
      else
        res.redirect('/book/list');
    });
  });

  route.get('/borrowBook', function(req, res) {
    var book_id = req.query.book_id;
    var sequence = req.query.sequence;
    var user_id = req.query.user_id;
    var param = [book_id, sequence];
    var param2 = [book_id, sequence, user_id];

    var sql = 'update book set status = 0, borrow_Count = borrow_Count+1 where book_id=? and sequence=?';
    var sql2 = 'insert into user_history(book_id, sequence, user_id, borrow_date, return_date) '
             + ' values(?, ?, ?, now(), null) ';
    console.log(sql);
    sql = mysql.format(sql, param);

    connection.query(sql, param, function(err) {
      if (err)
        throw err;
      else {
        res.send({
          result: 'success'
        });
        console.log('success');
      }
    });

    connection.query(sql2, param2, function(err){
      if(err)
        throw err;
    });
  });
    route.get('/reciveBook', function(req, res) {
      var book_id = req.query.book_id;
      var sequence = req.query.sequence;
      var user_id = req.query.user_id;
      var param = [book_id, sequence];

      var sql = 'update book set status = 1 where book_id=? and sequence=?';
      var sql2 = 'update user_history '
               + ' set return_date = now() '
               + ' where book_id = ? and sequence = ? and return_date is null ';
      console.log(sql);
      sql = mysql.format(sql, param);

      connection.query(sql, param, function(err) {
        if (err)
          throw err;
        else {
          res.send({
            result: 'success'
          });
          console.log('success');
        }
      });

      connection.query(sql2, param, function(err){
        if(err)
          throw err;
      });
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

route.get('/wish_book_form', function(req, res){
  res.render('book/wish_book_form');
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
