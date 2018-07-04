module.exports = {
  'secret' :  '',
  'db_info': {
    local: { // localhost
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'bitr33',
      database: 'node'
    }
  },
    'kakao' : {
      'client_id' : '11',
      'callback_url' : '/auth/login/kakao/callback'
    }
};
