module.exports = function(connection) {
  var express = require('express');
  var route = express.Router();
  route.get('/mypage', function(req, res) {
    var sql = 'SELECT * FROM USER';
    connection.query(sql, function(err, results, fields) {
      res.render('mypage/mypage', {
        layout: false,
        results: results
      });
    });
  });
  
  return route;
};
