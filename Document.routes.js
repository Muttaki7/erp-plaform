import express from "express";
import Document from "../models/Document.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (_, res) =>
    res.json(await Document.find())
);

export default router;
