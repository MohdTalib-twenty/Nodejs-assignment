const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");


const genreateToekn = async (id) => {
  return await jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};


const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcryptjs.compare(password, hashedPassword);
  return isMatch;
};

const getResetToken = () => {
  const restToken = randomstring.generate();
  return restToken;
};
const sendEmail = async (to, subject, text) => {
  var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "579000ad83c5b0",
      pass: "e89e03ee991284",
    },
  });
  await transporter.sendMail({
    to,
    subject,
    text,
  });
};

const Register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username) {
      next("Name is required");
    }
    if (!email) {
      next("Email is required");
    }
    if (!password) {
      next("Password is required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next("Email already registered please login");
    }

    const user = await new User(req.body);
    const token = await genreateToekn(User._id);
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Registration successfull",
      user: {
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      next("Please Enter all the fields");
    }
    const findUser = await User.findOne({ username });
    if (!findUser) {
      next("Invalid Username or Password");
    }
    const isMatch = await comparePassword(password, findUser.password);
    if (!isMatch) {
      next("Invalid Password");
    }
    const token = await genreateToekn(findUser._id);
    findUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login successfully",
      findUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const forgetPasswordContoller = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const resetToken = await getResetToken();
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            resetPasswordToken: resetToken,
            resetPasswordExpire: Date.now() + 15 * 60 * 1000,
          },
        }
      );
      const message = "Click on the link to reset your password";
      await sendEmail(email, "Reset Password", message);
      res.status(200).send({
        message : "Mail sent successfully"
      })
    } else {
      next("Please provide correct email");
    }
  } catch (error) {
    next(error);
  }
};
module.exports = { Register, Login, forgetPasswordContoller };
