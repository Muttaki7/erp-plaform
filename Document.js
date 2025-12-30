import mongoose from "mongoose";

export default mongoose.model(
    "Document",
    new mongoose.Schema({
        name: String,
        url: String,
        uploadedBy: String,
    })
);
