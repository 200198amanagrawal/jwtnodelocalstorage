var express = require('express');
var empModel=require('../modules/employee');
var uploadModel=require('../modules/upload');
var multer=require('multer');
var router = express.Router();
var path=require('path');
var employee=empModel.find({});
var imageData=uploadModel.find({});
var jwt= require('jsonwebtoken');

router.use(express.static(__dirname+"./public/"));
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


var Storage=multer.diskStorage({//the imp method which is used to store the file to that location.
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
      //cb=>callby
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

var upload=multer(//here upload is the middleware which would be used in the below post method
  {
    storage:Storage
}).single('file');//the single file is uploaded thats why we are using single.


router.post('/upload',upload, function(req, res, next) {
  var imageFile=req.file.filename;
  var success=req.file.filename+"uploaded successfully";
  var imageDetails=new uploadModel({
    imagename:imageFile
  });
  imageDetails.save(function(err,doc){
    if(err) throw err;
    imageData.exec(function(err,data){
    if(err) throw err;
    res.render('uploadfile', { title: 'Upload the file',records:data,success:success });
  })
  });
});

 


/* GET home page. */



router.get('/upload', function(req, res, next) {
  imageData.exec(function(err,data){
    if(err) throw err;
    res.render('uploadfile', { title: 'Upload the file',records:data,success:success });
  })
});


router.get('/', function(req, res, next) {
  employee.exec(function(err,data)
  {
    if(err) throw err;
  res.render('index', { title: 'Employee Records',records:data,success:"" });
  })
});//just a simple select data from the db

router.get('/login', function(req, res, next) {
  res.send("Login successfully");
});


router.get('/logout', function(req, res, next) {
  res.send("Logout successfully");
});


router.post('/', function(req, res, next) {//just a simple insert data from db
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
    res.render('index', { title: 'Employee Records',records:data,success:"Records added successfully" });
  })
 });
});

//filtering the data on the basis on filter selected
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
    res.render('index', { title: 'Employee Records',records:data,success:"Records filtered successfully" });
  });
});

//deleting the records
router.get('/delete/:id', function(req, res, next) 
{
  var id=req.params.id;
  var del=empModel.findByIdAndDelete(id);
  del.exec(function(err,data)
  {
    if(err) throw err;
    employee.exec(function(err,data)
    {
      if(err) throw err;
    res.render('index', { title: 'Employee Records',records:data,success:"Records deleted successfully" });
  });
  });
});


//updating the records
router.get('/edit/:id', function(req, res, next) 
{
  var id=req.params.id;
  var edit=empModel.findById(id);
  edit.exec(function(err,data)
  {
    if(err) throw err;
    res.render('edit', { title: 'Edit Employee Records',records:data });
  });
});

router.post('/update/', function(req, res, next) {//just a simple insert data from db using the edit functionality
  var update=empModel.findByIdAndUpdate(req.body.id,{
    name:req.body.uname,
    email:req.body.email,
    etype:req.body.emptype,
    hourlyrate:req.body.hrlyrate,
    totalhous:req.body.ttlhr,
  });

   update.exec(function(err,data)
    {
      if(err) throw err;
      employee.exec(function(err,data)
    {
      if(err) throw err;
    res.render('index', { title: 'Employee Records',records:data,success:"Records updated successfully" });
  });
  });
});

module.exports = router;
