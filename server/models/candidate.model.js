import mongoose from "mongoose";
const loginschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

export const LoginRegister = mongoose.model("Login", loginschema);
