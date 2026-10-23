const User=require("../models/user")

const getAllUsers=async(req,res)=>{
    const users=await User.find().select("-password") //select("-password") : to not get the passwords of this users
    if(!users){
        return res.status(400).json({message:"no users found"})
    }
    res.status(200).json({users:users})
    //res.send("yow here u get all users wsap")
}

module.exports={getAllUsers}