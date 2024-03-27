const express=require('express');
const mongoose=require("mongoose");
const bcrypt=require('bcrypt');
const router=express.Router();
const jwt= require('jsonwebtoken')
const User = require('../Model/user');
const sendEmail=require('../Model/nodeMailer/sendEmail')


//register user
router.post('/register',async (req,res)=>{
        try {
            //console.log(req.body);
            const{username,email,password}=req.body
            const hashedPassword=await bcrypt.hash(password,10)
            const user=new User({username:username,email:email,password:hashedPassword})
            await user.save()
            res.status(200).json({message:"User Registered"})
            
            
        } catch (error) {
            console.log(error)
           res.status(400).json({error:"registration failed"})
            
        }
    })

    //login 
    router.post('/login',async (req,res)=>{
        try {
            //console.log(req.body);
            const {email,password}=req.body
            const user=await User.findOne({email})
            if(!user){
                return res.status(400).json({error:'Invalid email or password'
            })
            }
          
               const validPass=await bcrypt.compare(password,user.password)
               if (!validPass) {
                   return res.status(400).json({error:'Invalid email or password'})
               }
               if(user.blocked){
                return res.status(400).json({error:"user blocked"});
               }
             const token=jwt.sign({userId:user._id},"asfgf",{expiresIn:"1h"});
             res.status(200).json({token})
            }
         catch (error) {
            console.log(error)
           res.status(400).json({error:"login failed"})
            
        }
    })


      
//forgot password
router.post('/forgotpassword', async (req,res)=>{
    try {
        // Extract the email from the request body
        const {email} = req.body  
        // Find the user with the given email
        const user = await User.findOne({email})
        // If user is not found, return an error
        if (!user){
            return res.status(401).json({error:'user not found'})
        }
        // Generate a random OTP 
        const otp = Math.floor(Math.random() * 100000);
        // Update the user's OTP in the database
        const updateOtp = await User.findByIdAndUpdate(user._id,{otp:otp},{new:true})
        // If the OTP is successfully updated, send an email to the user with the OTP
        if (updateOtp) { 
          sendEmail(user.email, otp);
          const emailToken  = jwt.sign({emailId:email},"secretkey",{expiresIn:"1hr"});
          res.status(200).json({ message: "OTP sent to mail", emailToken });
        }}
      catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed" });
    }
  })
        
  router.post('/verification', async (req, res) => {
    try {
      const { otp, emailToken, password } = req.body;
      console.log(req.body);
      // Verify JWT
      const decoded = jwt.verify(emailToken, 'secretkey');
      const email = decoded.emailId;
      // Find user by email
      const user = await User.findOne({ email });
      console.log(user);
      // Check if OTP matches
      if (user.otp === otp) {//update pw ,otp=""
            //update password 
            const newPassword =await bcrypt.hash(password,10)
            const userId=user._id      
            const updatedPassword= await User.findByIdAndUpdate(userId,{password:newPassword,otp:""},{new: true}) 
            if(updatedPassword){
              return res.status(201).json({ message: "Password updated" })
              }
            }
          res.status(500).json({error:"error"})
          } catch (error) {
              console.log(error);
              res.status(401).json({error:'error'})
          }  
          });

       //get all users
    router.get('/allusers', async (req, res) => {
        try {
            const users = await User.find();
            
            if(users.length === 0){
                return res.status(404).json({ message: "No users found!" });
            }
            
            return res.status(200).json(users);
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
   

    //delete a user by id
    router.delete('/userdelete/:id', async (req ,res)=> {
        const userId = req.params.id ;
        if (!userId ) {
            return res.status(400).json ({ message : 'no ID provided' });
        }
        const deleteUser = await User.findOneAndDelete({_id:userId});
        if (!deleteUser) {
            return res.status(400).json ({ message : 'No User with that Id!' });
        }
        res.json({ message: 'User removed' });
    });
   
//block user
    // router.put('/block/:id', async (req, res) => {
    //   const id = req.params.id;
    //   try {
    //     const blockUser = await User.findById(id);
    
    //     if (!blockUser) {
    //       return res.status(404).json({ message: "User not found" });
    //     }
    //     blockUser = await User.findByIdAndUpdate(id,{ blocked : !(blockUser.blocked) },{new:true})
    
    //     res.status(200).json({ message:(blockUser.blocked)?"user blocked":"user unblocked" });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: "An unexpected error occurred while blocking the user." });
    //   }
    // });



//update a user
router.put('/userupdate/:id', async (req ,res) =>{
    const userId = req.params.id;
    const updateField = req.body;

    if (!userId || !updateField ) {
        return res.status(400).json ({ msg : 'Missing fields' });
    }      

    let foundUser = await User.findById(userId)
    if (!foundUser) {
        return res.status(400).json ({ msg : 'No such User in the database.' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set : updateField }, { new: true} );
    res.json(updatedUser);
 });
    


 //user profile
router.get("/userprofile/:token", async (req, res) => {
    try {
      const {token} = req.params;
      console.log(token);
      
      const decoded=jwt.verify(token,'asfgf')
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Return user profile data
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  router.put('/editProfile/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const userDetails = req.body;
  
      const decoded = jwt.verify(token, 'asfgf');
      const userU = await User.findByIdAndUpdate(decoded.userId, { $set: userDetails }, { new: true });
      res.status(200).json(userU);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
 
 module.exports=router