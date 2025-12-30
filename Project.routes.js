import express from "express";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (_, res) =>
    res.json(await Project.find())
);

export default router;
