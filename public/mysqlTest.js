var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'root',
  password : 'bitr33',
  database : 'node'
});

connection.connect(function(err) {
  if(err) {
    console.error('mysql connection error');
    console.error(err);
    throw err;
  } else {
    console.log('연결에 성공하였습니다.');
  }
});
///auth/login/kakao/callback
