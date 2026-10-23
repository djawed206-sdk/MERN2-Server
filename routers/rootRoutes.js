//here we keep and write all the routs that we need only endpoints ,we can also do many folder like this which one for usersRouter other for postsRouter but we change the url "/users" in app.js on calling it

const express=require("express")
const path=require("path")
const getWsap = require("../controllers/wsapController")
const router=express.Router() //here we create the router that we need to attach it to the app after using "use"

router.get("/wech",(req,res)=>{ //first endpoint in root means localhost:3000/wech
  res.sendFile(path.join(__dirname,"..","views","wech.html"))//here it wont work without using ".." because views it isnt at the same level as routers , because __dirname is gonna show u the folders where u are then u write the name of each one till u arrive to where u want
})

router.get("/wsap",getWsap)  //so here instead of writing it here the function ,its better archetecture to do it in a controller

module.exports=router