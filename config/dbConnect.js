import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGODB_URL);
    mongoose.set("strictQuery", false);
    console.log(`Database connected successfully with ${connected.connection.host} `);
  } catch (error) {
    console.log(`NO DATA || Error : ${error.message}`);
    // process.exit([1]);
  }
};



export default dbConnect
// Import-Module PSReadLine