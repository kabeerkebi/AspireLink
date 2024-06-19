import express from "express";
import { AdminLogin } from "../../models/admin.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import verifyToken from "../../middlewares/verify-token.js";
dotenv.config();

const router = express.Router();

// Function to add default data
const updatedata = async () => {
  const Demodata = {
    email: "kebi@gmail.com",
    password: process.env.ADMIN_PASSWORD_SECRET,
  };

  try {
    const istype = await AdminLogin.findOne({ email: Demodata.email });

    if (!istype) {
      const Newdata = new AdminLogin(Demodata);
      await Newdata.save();
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

// Call the function to add default data
updatedata();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminLogin.findOne({ email });

    if (user) {
      if (user.password === password) {
        const accessToken = jwt.sign(
          { email: email },
          process.env.ADMIN_TOKEN_SECRET
        );

        res.json({
          success: true,
          message: "Login successful",
          adminToken: accessToken,
        });
      } else {
        res.json({ success: false, message: "Incorrect password" });
      }
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// admin log out

router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.send("Logged out successfully");
});

router.get("/check-admin-token", verifyToken, (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

export default router;
