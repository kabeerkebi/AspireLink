import express from "express";
import { Employerlogin } from "../../models/employer.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config();
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const response = await Employerlogin.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      companytype: req.body.companytype,
      // employernumber:body.employernumber,
      phonenumber: req.body.phonenumber,
      companyname: req.body.companyname,
    });
    const accessToken = jwt.sign(
      { email: req.body.email },
      process.env.EMPLOYER_TOKEN_SECRET
    );
    res
      .status(200)
      .json({ accessToken, response, id: response._id.toString() });
  } catch (error) {
    console.log(error);
  }
});

export default router;
