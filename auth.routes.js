import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.sendStatus(401);

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.sendStatus(401);

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
    );

    res.json({ token });
});

export default router;
