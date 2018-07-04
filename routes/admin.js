module.exports = function(connection){
  var express = require('express');
  var route = express.Router();

  route.get('/', function(req, res){
    res.render('admin/admin');
  });

  return route;
};
