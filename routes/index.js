var express = require('express');
var empModel=require('../modules/employee');
var router = express.Router();
var employee=empModel.find({});
/* GET home page. */
router.get('/', function(req, res, next) {
  employee.exec(function(err,data)
  {
    if(err) throw err;
  res.render('index', { title: 'Employee Records',records:data });
  })
});

module.exports = router;
