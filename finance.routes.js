import express from "express";
import auth from "../middleware/auth.js";
import Finance from "../models/Finance.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
    const data = await Finance.find();
    res.json(data);
});

router.post("/", auth, async (req, res) => {
    const item = await Finance.create(req.body);
    res.json(item);
});

export default router;
