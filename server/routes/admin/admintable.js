import express from "express";
import { Employerlogin } from "../../models/employer.model.js";
import mongoose from "mongoose";
const router = express.Router();

// to get all post job data
router.get("/getallemployerdata", async (req, res) => {
  try {
    const response = await Employerlogin.find({});
    res.json(response);
  } catch (error) {
    console.error("Error retrieving employer data:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
});

// to edit the data with id and index
router.put("/editemployerdata/:id/:index", async (req, res) => {
  try {
    const { id, index } = req.params;
    const editdata = req.body;
    const editemployerdata = await Employerlogin.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!editemployerdata) {
      return res
        .status(404)
        .json({ success: false, message: "Employer data not found" });
    }
    editemployerdata.postjobdata[index] = editdata;
    await editemployerdata.save();
    res
      .status(200)
      .json({ success: true, message: "Job edit updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
});

// to delete the data
router.delete("/deletedata/:id/:index", async (req, res) => {
  try {
    const { id, index } = req.params;
    const findthedata = await Employerlogin.findById(id);
    if (!findthedata) {
      return res
        .status(404)
        .json({ success: false, message: " data not found" });
      console.log("data is not found");
    }
    const update = {
      $pull: { postjobdata: findthedata.postjobdata[index] },
    };
    await Employerlogin.findByIdAndUpdate(id, update);
    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
});

export default router;
