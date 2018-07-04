var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection(require('./config/dbconfig.js'));

connection.connect((err), function(){
  if(err) {
    console.log(err);
    return;
  }
  console.log('mysql connect completed');
});

router.get('/', (req, res), function() {
  var sql = "select * from user";
  connection.query(sql, (err, results, field), function() {
    console.log(results);
    res.render('index', {
      layout : false,
      projects : results
    });
  });
});
module.exports = router;
