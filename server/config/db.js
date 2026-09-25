const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartwealth', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[SmartWealth Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[SmartWealth Database Error] ${error.message}`);
    console.error('Make sure MongoDB service is running (mongod or Windows service).');
    process.exit(1);
  }
};

module.exports = connectDB;
