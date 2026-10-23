//here connect to database mongoDb just like usual 
const mongoose=require("mongoose")

async function connectToMongoDB() { //avoid export here because it can cause problems 
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("You successfully connected to MongoDB!");

    return mongoose;
  } catch (err) {
    console.dir(err);
  }
}
// Call this only when your application terminates
async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}

module.exports=connectToMongoDB