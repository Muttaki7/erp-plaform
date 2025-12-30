import mongoose from "mongoose";

export default mongoose.model(
    "Customer",
    new mongoose.Schema({
        name: String,
        email: String,
        status: String,
        notes: String,
    })
);
