import express from "express";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/employees", auth, async (_, res) =>
    res.json(await Employee.find())
);

router.post("/leave", auth, async (req, res) =>
    res.json(await Leave.create(req.body))
);

export default router;
