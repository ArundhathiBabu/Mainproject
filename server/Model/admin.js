const mongoose=require('mongoose')

const adminSchema=new mongoose.Schema({
    username:{type : String , required :true,unique:true},  //name of the user
    email : { type :String , required : true,unique:true} , //email id of the user
    password : {type : String ,unique:true, required : true ,}
 },
 {timestamps:true})//this will create createdAt and updatedAt field in our schema automatically
 
module.exports= mongoose.model("Admin",adminSchema);
  