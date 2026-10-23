//so here we put the only origin that we allow to hava a connection with the server for the security
//and this origin on production it changes , so we will easily find it here
const allowedOrigin={
   origin: "https://localhost:5000",   // only your frontend
  credentials: true              // allow cookies/auth headers
}

module.exports=allowedOrigin