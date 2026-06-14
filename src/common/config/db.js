import mongoose from "mongoose";
import "dotenv/config";

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI); // db is in another continent

  console.log(`MongoDB is connected: ${conn.connection.host}`);
};

export default connectDb