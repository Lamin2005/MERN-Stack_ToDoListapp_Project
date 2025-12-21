import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import Todo from "./model/todolist.js";
import User from "./model/users.js";
import Password from "./utils/passwordMaker.js";
import cors from "cors";
import Token from "./utils/Token.js";
import authMiddleware from "./middleware/verifyToken.js";
import sendEmail from "./utils/sendEmail.js";
import otpEmailTemplate from "./utils/otpEmailTemplate.js";
import generateOTP from "./utils/generateOTP.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("mongodb connect successfully...");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/todolists", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).populate("user");

    console.log(todos);

    if (todos.length > 0) {
      res.json({ message: "Successfully Get Data...", result: todos });
    } else {
      res.json({ message: "No todolist available...", result: [] });
    }
  } catch (error) {
    res.json({ message: "Fail Get Data...", result: [] });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashpassword = await Password.encode(password);
    await User.create({ email, password: hashpassword });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await Password.compare(password, user.password);
      if (isMatch) {
        const token = Token.make({ id: user._id.toString() });
        console.log(token);
        return res
          .status(200)
          .json({ message: "Signin successful", result: user, token: token });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ message: "Get User successfully", result: user });
  } catch (err) {
    res.status(500).json({ message: "Error get Proile ", error: err.message });
  }
});

app.post("/todos", authMiddleware, async (req, res) => {
  const { title, description, priority } = req.body;
  const user = req.user;
  console.log(user);

  try {
    const newTodo = {
      title: title.toLowerCase(),
      description,
      priority,
      user: user.id,
    };

    await Todo.create(newTodo);

    res.status(201).json({ message: "Todo created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating todolist", error: err.message });
  }
});

app.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.resetOTP = otp;
    const OTP_EXPIRE_TIME = 60 * 1000;
    user.resetOTPExpire = Date.now() + OTP_EXPIRE_TIME;

    await user.save();

    await sendEmail(email, "Password Reset OTP", otpEmailTemplate(otp, email));

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Email not sent", error });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.json({ message: "OTP verified" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await Password.encode(newPassword);
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
});
