import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollno:{
        type: String,
        required: true
    },
      department:{
        type: String,
        required: true
    }, 
 
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});
const studentModel = mongoose.model("student",studentSchema);
export default studentModel;