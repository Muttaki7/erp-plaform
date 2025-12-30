import mongoose from "mongoose";

export default mongoose.model(
    "Leave",
    new mongoose.Schema({
        employeeId: mongoose.Schema.Types.ObjectId,
        from: Date,
        to: Date,
        status: { type: String, default: "PENDING" }
    })
);
