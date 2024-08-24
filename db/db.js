const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const URL = process.env.MONGODB_URL

const DB = async () => {
  try {
    await mongoose.connect(URL)
    console.log('MongoDB connected')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = DB