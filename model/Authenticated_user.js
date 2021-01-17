const mongoose = require("mongoose");

const authUserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
})

const authUser = mongoose.model("authenticatedUser", authUserSchema);

module.exports = authUser;

