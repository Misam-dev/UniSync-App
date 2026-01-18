import mongoose from "mongoose";

const societySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});
const societyModel = mongoose.model("society",societySchema);
export default societyModel;