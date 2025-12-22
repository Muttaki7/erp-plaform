import express from "express";
import auth from "../middleware/auth.js";
import Inventory from "../models/Inventory.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
    res.json(await Inventory.find());
});

export default router;
