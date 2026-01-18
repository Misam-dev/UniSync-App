import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "society",
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Event", eventSchema);
