const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Bro MongoDB Connected: ${conn.connection.host}`); // it will tell me which host is connected local or atlas
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
