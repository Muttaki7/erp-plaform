import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    createdBy: String
});

export default mongoose.model("Finance", financeSchema);
