import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:["Admin","Student","Society"],
        default: "Admin"
    }
},);

const userModel = mongoose.model("user",userSchema);
export default userModel;