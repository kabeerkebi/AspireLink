import { LoginRegister } from "../../models/candidate.model.js";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import verifyToken from "../../middlewares/verify-token.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await LoginRegister.findOne({ email: email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const accessToken = jwt.sign({ email: email }, process.env.CANDIDATE_TOKEN_SECRET);
        res.json({ success: true, token: accessToken });
      } else {
        res.json("password is incorrect");
      }
    } else {
      res.json("notfound");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.send("Logged out successfully");
});

router.get("/check-login", verifyToken, (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

export default router;