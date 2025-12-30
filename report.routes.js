import express from "express";
import Finance from "../models/Finance.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", auth, async (_, res) => {
    const total = await Finance.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json(total);
});

export default router;
