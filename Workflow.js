import mongoose from "mongoose";

export default mongoose.model(
    "Workflow",
    new mongoose.Schema({
        entity: String,
        state: String,
        approvedBy: String,
    })
);
