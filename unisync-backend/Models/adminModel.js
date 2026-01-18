import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});
const adminModel = mongoose.model("admin",adminSchema);
export default adminModel;