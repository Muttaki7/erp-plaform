import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/finance", financeRoutes);
app.use("/inventory", inventoryRoutes);

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
