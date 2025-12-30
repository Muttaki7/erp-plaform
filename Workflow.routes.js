import express from "express";
import Workflow from "../models/Workflow.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) =>
    res.json(await Workflow.create(req.body))
);

export default router;
