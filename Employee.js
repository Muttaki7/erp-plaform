import mongoose from "mongoose";

export default mongoose.model(
    "Employee",
    new mongoose.Schema({
        name: String,
        email: String,
        department: String,
        position: String,
        salary: Number,
    })
);
