const express=require("express");
const userModel = require("../Models/user");
const router=express.Router();


router.post("/register",async(req,res)=>{
    const newuser=new userModel({name:req.body.name,email:req.body.email,password:req.body.password})
    try
    {
        const user=await newuser.save()
        res.send({message:"User Registered Successfully"})
    }
    catch(error)
    {
          return res.status(400).json({error})
    }
});

router.post("/login",async(req,res)=>{
    const{email,password}=req.body
    try
    {
        const user=await userModel.findOne({email:email,password:password})
        if(user)
        {
            const temp={
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
                _id:user._id
            }
            res.send(temp)
        }
        else
        {
            return res.status(400).json({message:'Login Failed'});

        }
    }
    catch(error)
    {
        return res.status(400).json({error});
    }
});

router.get("/getallusers",async(req,res)=>{
    try {
        const users=await userModel.find()
        res.send(users)
    } 
    catch (error) {
        return res.status(400).json({error});
    }
})
module.exports=router