import jwt from "jsonwebtoken";

const Token = {
  make: (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  },
  verify: (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
  },
};

export default Token;