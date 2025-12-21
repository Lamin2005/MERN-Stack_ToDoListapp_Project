import Token from "../utils/Token.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Please Signup or Signin first..." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = Token.verify(token);
    req.user = decoded;
    console.log(req.user);

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
