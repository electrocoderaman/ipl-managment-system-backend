import mongoose from "mongoose";
import "dotenv/config";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI); // db is in another continent

  console.log(`MongoDB is connected: ${conn.connection.host}`);
};

export default connectDb;
