router.post('/login', function(req, res, next) {
  var
    user_id = req.body.user_id,
    password =   req.body.password;
  connection.query('select * from `user` where `user_id` = ?', user_id, function (err, result) {
    if (err) {
      console.log('err :' + err);
    } else {
      if (result.length === 0) {
        res.json({success: false, msg: '존재하지 않는 회원입니다.'})
      } else {
        if (!bcrypt.compareSync(password, result[0].password)) {
          res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
        } else {
          res.json({success: true})
        }
      }
    }
  });
});
module.exports = router;
