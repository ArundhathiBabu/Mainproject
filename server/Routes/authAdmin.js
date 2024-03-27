const express=require('express');
const mongoose=require("mongoose");
const bcrypt=require('bcrypt');
const router=express.Router();
const jwt= require('jsonwebtoken')
const  Admin = require('../Model/admin');
const User = require('../Model/user');


router.post('/adminregister',async (req,res)=>{
    try {
        //console.log(req.body);
        const{username,email,password}=req.body
        const hashedPassword=await bcrypt.hash(password,10)
        const admin=new Admin({username:username,email:email,password:hashedPassword})
        await admin.save()
        res.status(200).json({message:"User Registered"})
        
        
    } catch (error) {
        console.log(error)
       res.status(400).json({error:"registration failed"})
        
    }
})


router.post('/adminlogin',async (req,res)=>{
    try {
        //console.log(req.body);
        const {email,password}=req.body
        const admin=await Admin.findOne({email})
        if(!admin){
            return res.status(400).json({error:'Invalid email or password'
        })
        }
      
           const validPass=await bcrypt.compare(password,admin.password)
           if (!validPass) {
               return res.status(400).json({error:'Invalid email or password'})
           }
         const token=jwt.sign({adminId:admin._id},"asfgf",{expiresIn:"1h"});
         res.status(200).json({token})
        }
     catch (error) {
        console.log(error)
       res.status(400).json({error:"login failed"})
        
    }
})

   //block user
router.put('/block/:id', async (req, res) => {
    const id = req.params.id;
    try {
      let blockUser = await User.findById(id);
  
      if (!blockUser) {
        return res.status(404).json({ message: "User not found" });
      }
      blockUser = await User.findByIdAndUpdate(id,{ blocked : !(blockUser.blocked) },{new:true})
  
      res.status(200).json({ message:(blockUser.blocked)?"user blocked":"user unblocked" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An unexpected error occurred while blocking the user." });
    }
  });



  //delete user
router.delete("/deleteuser/:id", async (req, res) => {
    const userDelete = req.params.id;
    console.log(req.params.id);
    if (!userDelete) {
      return res.status(400).json({ message: "no ID provided" });
    }
    const deleteUser = await User.findOneAndDelete({ _id: userDelete });
    if (!deleteUser) {
      return res.status(400).json({ message: "No user with that Id!" });
    }
    res.json({ message: "User removed" });
  });


  //get all users
router.get("/allusers", async (req, res) => {
    try {
      // Finding all user in the database
      const users = await User.find();
  
      // Sending a success response with the found users
      return res.status(200).json(users);
    } catch (error) {
      // Logging the error
      console.error(error);
  
      // Sending an error response
      return res.status(500).json({ message: "Error retrieving users" });
    }
  });
  
  

module.exports=router