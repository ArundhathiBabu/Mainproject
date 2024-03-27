const express=require('express' );
const mongoose = require('mongoose');
const port= 3001;
const authUser=require('./Routes/authUser')
const authAdmin=require('./Routes/authAdmin');
const authproduct=require('./Routes/authProduct');
const cors=require('cors');
const helmet=require('helmet');
const Razorpay = require('razorpay');
const crypto=require("crypto")
const payment =require('./Model/payment')
require("dotenv").config();
const app=express();
app.use(cors());
app.use(helmet());


app.use(express.json())
app.use('/auth',authUser);
app.use('/auth',authAdmin);
app.use('/auth',authproduct);
app.use(express.static("uploads"))




app.use(express.urlencoded({extended:false}));

app.post("/order",async (req,res)=>{
try{
    const razorpay =new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });

    const options =req.body;
    // const options =  {amount: 50000,  // amount in the smallest currency unit
    // currency: "INR",
    // receipt: "order_rcptid_11"}
 
    razorpay.orders.create(options,function(err,orde){
        console.log("line 41")
        console.log(orde)
        if(!orde){
            return res.status(500).send("Error")
        }
        else{
            res.json(orde);
        }
        
    });
    
    
    
}
catch(err){
    console.log(err);
    res.status(500).send("Error");
    
}

})


app.post("/order/validate", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    //order_id + "|" + razorpay_payment_id
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }
  
    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  });





app.listen(port,()=>{
    console.log("Server is running")
});



//connecting to the database
mongoose.connect('mongodb://localhost:27017/everglow',{useNewUrlParser : true , useUnifiedTopology : true})
     .then(()=>{
     console.log('Connected to Database')
    })
     .catch((err)=>{
        console.log(err)
    });

     


