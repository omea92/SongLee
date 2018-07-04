module.exports = function(connection) {
  var express = require('express');
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
  route.get('/', function(req, res){
    console.log('4days');
  });
  return route;
};
