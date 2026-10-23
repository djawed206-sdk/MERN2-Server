const express=require("express")
const router=express.Router()

const {register, refresh, logout}=require("../controllers/authController")
const {login}=require("../controllers/authController")

//register route (using registerController)
router.post("/register",register)

//login route (using loginController)
router.post("/login",login)

//refresh route(using refreshController)
router.get("/refresh",refresh) //why get no post bcs we will not type anything to the server bcs cookies already do that so we only gonna get the new access token

//logout route(using logoutController)
router.post("/logout",logout) //why here post and not get because we are not gonna get something but we gonna set the cookies so this is post 

module.exports=router