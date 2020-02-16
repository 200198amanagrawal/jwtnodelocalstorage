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



router.post('/', function(req, res, next) {
  var empDetails=new empModel(
    {
      name:req.body.uname,
      email:req.body.email,
      etype:req.body.emptype,
      hourlyrate:req.body.hrlyrate,
      totalhous:req.body.ttlhr,
    }
  );
 empDetails.save(function(err,res1)
 {
   if(err) throw err;
   employee.exec(function(err,data)
    {
      if(err) throw err;
    res.render('index', { title: 'Employee Records',records:data });
  })
 });//inserting the data
});
router.post('/search/', function(req, res, next) {
var filtername=req.body.fltrname;
var filteremail=req.body.fltremail;
var filteremptype=req.body.fltremptype;
if(filtername!='' && filteremail!='' && filteremptype!='')//if nothing is empty
{
  var filterParameter={$and:[{name:filtername},
  {$and:[{email:filteremail},{etype:filteremptype}]}
]
}
}
else if(filtername!='' && filteremptype!='')//only email can be null
{
  var filterParameter={$and:[{name:filtername},{etype:filteremptype}]
}
}
else if(filteremail!='' && filteremptype!='')//only name can be null
{
  var filterParameter={$and:[{name:filteremail},{etype:filteremptype}]
}
}
else
{
  var filterParameter={};
}
var employeeFilter=empModel.find(filterParameter);
employeeFilter.exec(function(err,data)
{
      if(err) throw err;
    res.render('index', { title: 'Employee Records',records:data });
  });
});
module.exports = router;
