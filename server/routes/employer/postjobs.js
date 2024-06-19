import express from "express";
import { Employerlogin } from ".././../models/employer.model.js";
import mongoose from "mongoose";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();
// to get post job data to candidate page
router.get("/getdata", async (req, res) => {
  const result = await Employerlogin.find({}).select({
    companyname: false,
    email: false,
    _id: false,
    phonenumber: false,
    companytype: false,
    password: false,
  });
  res.json(result);
});

// to push the  data to backend
router.put("/:id", async (req, res) => {
  try {
    const { postjobdata } = req.body;
    await Employerlogin.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
      {
        $push: { postjobdata: postjobdata },
      }
    );
    res.json({ success: true, message: "Data is successfully added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to add data" });
  }
});

// // Update profile photo for candidate
// const toupdateProfilePhoto = async () => {
//   // Check if profile picture already exists for candidate
//   const candidate = await Employerlogin.findOne({});

//   // If profile picture does not exist, save default "thereisnoimage" picture
//   if (!candidate.profilepictures) {
//     candidate.profilepictures = "thereisnoimage";
//     await candidate.save();
//   }
// };
// toupdateProfilePhoto();
// to add image
router.put(
  "/profilepicturedata/:id",
  upload.single("profilephoto"),
  async (req, res) => {
    try {
      const { filename } = req.file;
      const UpdateEmployerImage = await Employerlogin.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
        {
          profilepictures: filename,
        },
        { new: true }
      );
      if (!UpdateEmployerImage) {
        return res
          .status(404)
          .json({ success: false, message: "Employer not found" });
      }
      res.json({
        success: true,
        message: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile picture",
      });
    }
  }
);
// to delete image
router.delete("/deletedata/:id", async (req, res) => {
  await Employerlogin.updateOne(
    {
      _id: new mongoose.Types.ObjectId(req.params.id),
    },
    {
      $set: {
        profilepictures: "",
      },
    }
  );
  res.json({
    success: true,
    message: "Profile picture deleted successfully",
  });
});

// to data with index number
router.put("/updatedatas/:id/:index", async (req, res) => {
  try {
    const { id, index } = req.params;

    const { updatedData } = req.body;
    const employerdata = await Employerlogin.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!employerdata) {
      return res
        .status(404)
        .json({ success: false, message: "Employer data not found" });
    }
    employerdata.postjobdata[index] = updatedData;

    await employerdata.save();

    res
      .status(200)
      .json({ success: true, message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
});

router.delete("/deleteData/:id/:index", async (req, res) => {
  try {
    const { id, index } = req.params;

    // Find the employer data document by id
    const employerData = await Employerlogin.findById(id);

    if (!employerData) {
      return res
        .status(404)
        .json({ success: false, message: "Employer data not found" });
      console.log("data is not found");
    }

    // Construct the update operation to delete the element at the specified index
    const update = {
      $pull: { postjobdata: employerData.postjobdata[index] },
    };

    // Apply the update operation
    await Employerlogin.findByIdAndUpdate(id, update);

    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
});

// to get all filter data

router.get("/togetalldatas", async (req, res) => {
  try {
    const result = await Employerlogin.find({}).select({
      companyname: false,
      email: false,
      _id: false,
      phonenumber: false,
      companytype: false,
      password: false,
    });

    let allPostJobData = [];
    result.forEach((item) => {
      allPostJobData.push(...item.postjobdata);
    });
    res.json({ thedata: allPostJobData, status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get data with index number

router.get("/getnumber/:index", async (req, res) => {
  try {
    const { index } = req.params;
    const result = await Employerlogin.find({}).select({
      companyname: false,
      email: false,
      _id: false,
      phonenumber: false,
      companytype: false,
      password: false,
    });

    let allPostJobData = [];
    result.forEach((item) => {
      allPostJobData.push(...item.postjobdata);
    });

    const finaldata = allPostJobData[index];
    res.json({ thedata: finaldata, status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/similarjobs/:id/:index", async (req, res) => {
  const { index, id } = req.params;
  const parsedIndex = parseInt(index); // Parse the index to an integer

  try {
    // Retrieve all employers' data
    const result = await Employerlogin.find({}).select({
      companyname: false,
      email: false,
      _id: false,
      phonenumber: false,
      companytype: false,
      password: false,
    });

    let TheFinaldata = [];
    let allPostJobData = [];
    let counter = 0; // Initialize the counter

    result.forEach((item) => {
      item.postjobdata.forEach((postjob) => {
        allPostJobData.push({ ...postjob, index: counter });
        counter++; // Increment the counter for each job post
      });
    });

    // Get the category of the specific job post
    const targetCategory = allPostJobData[parsedIndex].datas.Category;

    if (!targetCategory) {
      return res.status(200).json({ Thedata: [] });
    }

    allPostJobData.forEach((itm) => {
      if (itm.datas.Category === targetCategory && itm.index !== parsedIndex) {
        TheFinaldata.push(itm);
      }
    });

    res.status(200).json({ Thedata: TheFinaldata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//  to get  his  with id data

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Employerlogin.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

export default router;
