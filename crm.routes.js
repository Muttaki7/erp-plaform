import express from "express";
import Customer from "../models/Customer.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (_, res) =>
    res.json(await Customer.find())
);

router.post("/", auth, async (req, res) =>
    res.json(await Customer.create(req.body))
);

export default router;
