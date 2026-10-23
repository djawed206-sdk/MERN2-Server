require("dotenv").config()  //here to allow using dotenv to mask password URI ets 
const express=require("express")  //this for creating the server
const mongoose=require("mongoose")  //this for the database
const connectDB=require("./config/connectDB") 
const cors=require("cors")  //this to allow other origins (frontend) to connect to the server
const allowedOrigin=require("./config/allowedOrigin")
const cookieParser=require("cookie-parser") //this to send cookies for each request
const path = require("node:path") //to use it to send html files and css files with it


const app=express() //built the server using express

app.use(cors(allowedOrigin)) //allow only the frontend mentioned to connect to the server
app.use(express.json()) //allow receiving json not undefined 
app.use(cookieParser()) //use the cookie 


//fixing the probleme of the dns in my computer that affects the server connection with the database , but on production i should not use this fix bcs i will be using the dns of another computer ruuning on the internet that has a good dns 
//so basically on production Render, Railway, Heroku, Vercel, Fly.io: they set NODE_ENV=production automatically for Node apps
if (process.env.NODE_ENV !== 'production') {
  const dns = require('node:dns');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

connectDB() //now u can connect




app.use(express.static(path.join(__dirname,"public")))
//It tells Express: “treat the public folder as the root of the site.” When a request comes in for /css/style.css, Express looks for that path inside public, so it serves public/css/style.css.
//Request URL:   /css/style.css
//Express looks: <your project>/public + /css/style.css



//endpoint
//here the endpoints for the root
app.use("/",require("./routers/rootRoutes")) // "/" means this is the root router, when u get a request of root like "localhost:3000/here" use this router and look for the endpoint if he doesnt find its 404, unless u add another router "/users" or idk it goes directly to this router not this root 
//here the endpoints of the auth (contains register and login endpoints and also refresh for expired tokens)
app.use("/auth",require("./routers/authRoutes"))

//here for the users (like get all users), and btw we did this to verify the usibility of the token using the middeelweare that's all , and here to get all users u just need to be loged in that's all not a special person or idk 
//so the middelwars for protection (protect the routs) whih each route verify your token if its false one no next() and no response
app.use("/users",require("./routers/usersRoutes"))


//error handling endpoint
app.use((req,res)=>{ //meaning in case of entering others routes that doesnt exist
  res.status(404)
  res.sendFile(path.join(__dirname,"views","404.html"))//this is how to send a static html file only 
})





const PORT=process.env.PORT || 3000 //the first is for production only , if there is no production yet use port 3000
mongoose.connection.once("open",()=>{
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
})

