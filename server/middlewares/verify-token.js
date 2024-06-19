import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token || token === "Bearer false") {
    return res
      .status(401)
      .send({ unauthorized: true, message: "Unauthorized", success: false });
  }

  token = token.split(" ")[1];
  let secret;

  // Determine which secret to use based on the route
  if (req.path.includes("/check-login")) {
    secret = process.env.CANDIDATE_TOKEN_SECRET;
  } else if (req.path.includes("/check-employerlogin")) {
    secret = process.env.EMPLOYER_TOKEN_SECRET;
  } else if (req.path.includes("/check-admin-token")) {
    secret = process.env.ADMIN_TOKEN_SECRET;
  } else {
    return res
      .status(401)
      .send({ unauthorized: true, message: "Unauthorized", success: false });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.token = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ unauthorized: true, message: "Unauthorized", success: false });
  }
};
