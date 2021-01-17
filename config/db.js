const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex:true,
            useUnifiedTopology:true
        })
    
        console.log("MongoDB connection established...")
    } catch (err) {
        console.log(err);
    }
}


module.exports = connectDB;