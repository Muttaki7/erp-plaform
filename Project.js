import mongoose from "mongoose";

export default mongoose.model(
    "Project",
    new mongoose.Schema({
        name: String,
        status: String,
        startDate: Date,
        endDate: Date,
    })
);
