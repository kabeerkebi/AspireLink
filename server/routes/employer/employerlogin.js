import express from "express";
import { Employerlogin } from "../../models/employer.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyToken from "../../middlewares/verify-token.js";
import bcrypt from "bcrypt"
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password, companyname } = req.body;

  try {
    const user = await Employerlogin.findOne({
      email: email,
      companyname: companyname,
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const accessToken = jwt.sign(
          { email: email },
          process.env.EMPLOYER_TOKEN_SECRET
        );
        res.json({
          success: true,
          message: "Login successful",
          id: user._id.toString(),

          token: accessToken,
        });
      } else {
        res.json({ success: false, message: "Password is incorrect" });
      }
    } else {
      res.json({ success: false, message: "Data not found" });
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



router.get("/check-employerlogin", verifyToken, (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});


export default router;
