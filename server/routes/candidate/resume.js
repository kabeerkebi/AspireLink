import express from "express";
import { Employerlogin } from "../../models/employer.model.js";
import multer from "multer";
import mongoose from "mongoose";
import { uploads } from "../../middlewares/resumemulter.js";
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../../public/pdf");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, `${uniqueSuffix}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });
const router = express.Router();

router.post("/:id", uploads.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const formdata = req.body;
    const theresumeOBJ = {
      phonenumber: req.body.phonenumber,
      thepdf: req.file.filename,
      expirence: req.body.expirence,
      name: req.body.name,
    };

    await Employerlogin.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        $push: { theresume: theresumeOBJ },
      }
    );
    res.json({ success: true, message: "Data is successfully added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to add data" });
  }
  // const phonenumber = req.body.phonenumber;
  // const fileName = req.file.filename;
  // const expirence = req.body.expirence;

  // try {
  //   const
  //   await .create({
  //     phonenumber: phonenumber,
  //     resume: fileName,
  //     expirence: expirence,
  //     name: name,
  //   });
  //   res.send({ status: "ok" });
  // } catch (error) {
  //   console.log("saving errpre " + error);
  // }
});

// delete the pdf data
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
      $pull: { theresume: employerData.theresume[index] },
    };

    // Apply the update operation
    await Employerlogin.findByIdAndUpdate(id, update);

    res
      .status(200)
      .json({ success: true, message: "Job resume  deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
});
export default router;
