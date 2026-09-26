let express=require('express');
let router=express.Router();
let bcrypt=require('bcrypt');
let users=require('../models/user');

router.post(['/register', '/auth/register'],async(req,res)=>{
    let data=req.body;
    let hashedPassword=await bcrypt.hash(data.password,10);
    data.password=hashedPassword;
    let newUser=new users(data);
    let result=await newUser.save();
    //let responseUser=result.toObject();
    //delete responseUser.password;
    res.status(201).send(result);
});
router.post(['/login', '/auth/login'],async(req,res)=>{
    let user=await users.findOne({email:req.body.email}).select('+password');
    if(!user){
        return res.status(400).send("user not found");
    }
    let passwordMatches=await bcrypt.compare(req.body.password,user.password);
    if(!passwordMatches){
        return res.status(401).send("invalid password");
    }
    res.send({message:"login successful",user:{id:user._id,name:user.name,email:user.email,role:user.role}});
})
router.get("/viewtasks",async(req,res)=>{
    res.send("view tasks page called")
})

router.patch('/updateprofile/:id',async(req,res)=>{
    let data=req.body;
    if(data.password){
        data.password=await bcrypt.hash(data.password,10);
    }
    let updatedata=await users.findByIdAndUpdate(req.params.id,{$set:data});
    if (updatedata) {
        res.send(updatedata);
    } else {
        res.status(404).send({message:"User not found"});
    }
});
module.exports=router;