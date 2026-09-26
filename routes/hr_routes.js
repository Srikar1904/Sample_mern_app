let express=require('express');
let router=express.Router();
let users=require('../models/user');

router.get('/employees',async(req,res)=>{
    try {
        let result=await users.find({role:'EMPLOYEE'});
        res.send(result);
    } catch (error) {
        res.status(500).send({message:error.message});
    }
}) 
router.delete('/deleteemp/:id',async(req,res)=>{
    let result=await users.findByIdAndDelete(req.params.id);
    if (result) {
        res.send({message:"Employee deleted successfully"});
    } else {
        res.status(404).send({message:"Employee not found"});
    }   
});

router.post('/assign-task',async(req,res)=>{
    res.send("assign task page called");
})
module.exports=router;