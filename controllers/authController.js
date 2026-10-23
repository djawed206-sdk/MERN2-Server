const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register
const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "a field is missing" });
  }

  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return res.status(401).json({ message: "user already exist" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });
  const user = await newUser.save();

  //the access and refresh token ,The short version:
  //Access token: a short-lived key you send with every request to prove who you are.
  //Refresh token: a long-lived key used only to get a new access token when the old one expires.
  const accesToken = jwt.sign(
    {
      userInfo: {
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  //this to set a cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // JS in the browser can't read this cookie (blocks token theft via XSS)
    secure: true, // only sent over HTTPS in production, so it still works on http://localhost
    sameSite: "strict", // cookie is only sent when the request comes from your own site (defends against CSRF)
    maxAge: 7 * 24 * 60 * 60 * 1000, // lifetime in milliseconds: 7 days (match your refresh token's expiresIn)
  });
  //res.cookie is correct (singular). cookies is plural only on the request side.

  res.status(200).json({
    message: "user registerd succusfilly!",
    user: {
      firstName,
      lastName,
      email,
    },
    token: accesToken,
  });
};




//loginController

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "a field is missing" });
  }

  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(401).json({ message: "wrong email or password" });
  }

  const isSamePassword = await bcrypt.compare(password, userExist.password);
  if (!isSamePassword) {
    return res.status(401).json({ message: "wrong email or password" });
  }

  //the access and refresh token ,The short version:
  //Access token: a short-lived key you send with every request to prove who you are.
  //Refresh token: a long-lived key used only to get a new access token when the old one expires.
  const accesToken = jwt.sign(
    {
      userInfo: {
        id: userExist._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  ); //u can do it in seconds to try refresh token

  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: userExist._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({
    messgae: "loged in succusfully",
    user: {
      firstName: userExist.firstName,
      lastName: userExist.lastName,
      email: userExist.email,
    },
    token: accesToken,
  });
};



//refresh token
const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "unautorized" });
  }
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "forbidden" });

      const findUser = await User.findById(decoded.userInfo.id);
      if (!findUser) return res.status(401).json({ message: "unauthorized" });

      const accesToken=jwt.sign({
        userInfo:{
            id:findUser._id
        }
      },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
      
      res.status(200).json({
        newToken:accesToken
        })
   
    },
  );

 
};



//logout
const logout=(req,res)=>{
    const cookies=req.cookies
    if(!cookies?.jwt){
       return res.sendStatus(204) //no content
       //or return res.status(204).json({message:"no content"})
    }

    res.clearCookie("jwt",{
        httpOnly:true,
        secure:true,
        sameSite:"strict"
    })

    res.status(200).json({message:"loged out succusfully"})
}


module.exports = { register, login, refresh,logout };
