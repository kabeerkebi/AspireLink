import mongoose from "mongoose";
const employerschema = mongoose.Schema({
  companyname: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  // employernumber: {
  //   type: String,
  //   required: true,
  // },
  phonenumber: {
    type: String,
    required: true,
  },
  companytype: {
    type: String,
    required: true,
  },
  postjobdata: {
    required: false,
    default: [],
    type: Array,
  },
  profilepictures: {
    type: String,
    required: false,
  },
  theresume: {
    type: Array,
    default: [],
    required: false,
  },

});

export const Employerlogin = mongoose.model("employerlogin", employerschema);
