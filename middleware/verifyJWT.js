const jwt=require("jsonwebtoken")
const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers.authorization

    if(!authHeader?.startsWith("Bearer ")){
       return res.status(401).json({message:"unauthorized"})
    }
    const token=authHeader.split(" ")[1]

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(403).json({message:"Forbidden"}) //if there is an error like couldnt decode it to get an id of the user so its error this token is wrong or made up
        }
        req.user=decoded.userInfo.id //if its get here this means there is no error and it decoded rightly the token and got an id (the userInfo) so this user is officially authorize , but attention this token has an expericy so after 15m this token wont work and will show err so be aware of this .
        next()
    })
   // next()

}

module.exports=verifyJWT