const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{type : String , required :true,unique:true},  //name of the user
    email : { type :String , required : true,unique:true} , //email id of the user
    password : {type : String ,unique:true, required : true},   //password for authentication
    otp:{type:Number},
    blocked: { type : Boolean, default: false },//one time password to verify the account
    mobileNumber:{type:String},   //mobile number of the user 
    pincode:{type:Number},
    address:{type:String},     //address of the user
    city:{type:String}//city in which user lives

    })//this will create createdAt and updatedAt field in our schema automatically
 
module.exports= mongoose.model("User",userSchema);
  