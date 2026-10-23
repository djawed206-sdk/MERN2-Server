const express=require("express")
const { getAllUsers } = require("../controllers/usersController")
const verifyJWT = require("../middleware/verifyJWT")
const router=express.Router()

router.get('/',verifyJWT,getAllUsers)

module.exports=router