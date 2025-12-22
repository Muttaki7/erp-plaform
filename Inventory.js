import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    name: String,
    quantity: Number
});

export default mongoose.model("Inventory", inventorySchema);
