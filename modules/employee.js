var mongoose=require("mongoose");//general way to make a schema in mongoose or mongodb.
mongoose.connect('mongodb://localhost:27017/employee', {useNewUrlParser: true});
var conn=mongoose.connection;
var employeeSchema=new mongoose.Schema({
    name:String,
    email:String,
    etype:String,
    hourlyrate:Number,
    totalhous:Number,
})

var employeeModel=mongoose.model("Employee",employeeSchema);

module.exports=employeeModel;