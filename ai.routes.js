import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/ask", auth, async (req, res) => {
    const q = req.body.question;
    res.json({ answer: `AI Response for: ${q}` });
});

export default router;
