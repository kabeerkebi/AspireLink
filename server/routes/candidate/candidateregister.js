import { LoginRegister } from "../../models/candidate.model.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const response = await LoginRegister.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // Store hashed password in the database
    });

    const accessToken = jwt.sign({ email: req.body.email },  process.env.CANDIDATE_TOKEN_SECRET);

    res.status(200).json({ response, token: accessToken ,  success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
