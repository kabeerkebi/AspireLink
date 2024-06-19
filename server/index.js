import express from "express";
import { MONGODBCONNECTION, PORT } from "./connection.js";
import cors from "cors";
import cookieparser from "cookie-parser";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import cadidatelogin from "./routes/candidate/candidatelogin.js";
import cadidateRegister from "./routes/candidate/candidateregister.js";
import empyerloyerlogin from "./routes/employer/employerlogin.js";
import employerRegister from "./routes/employer/employerregister.js";
import potjobs from "./routes/employer/postjobs.js";
import admintable from "./routes/admin/admintable.js";
import adminlogin from "./routes/admin/adminlogin.js";
import resume from "./routes/candidate/resume.js";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieparser());
// for store the resume pdf
app.use(
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "./public/pdf")
  )
);
//  for store the images
app.use(
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "./public/images")
  )
);

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("welcome to mern stack ");
});

// the midlleware from routes
app.use("/apis/register", cadidateRegister);
app.use("/apis/logindata", cadidatelogin);
app.use("/apis/employerlogin", empyerloyerlogin);
app.use("/apis/employerregister", employerRegister);
app.use("/apis/postjob", potjobs);
app.use("/apis/admin", admintable);
app.use("/apis/adminlogin", adminlogin);
app.use("/apis/resume", resume);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(MONGODBCONNECTION)
  .then(() => console.log("data base is connected"))
  .catch((er) => console.log(`data base erorr : ${er}`));
