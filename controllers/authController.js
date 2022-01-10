const bcrpyt = require("bcryptjs");

const User = require("../models/userModel");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrpyt.hash(password, 12);
  try {
    const user = await User.create({
      username,
      password: hashedPassword,
    });
    req.session.user = user;
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

exports.logIn = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch) {
      req.session.user = user;
      console.log(req.session.user);
      res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    } else {
      res.status(200).json({
        success: true,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};
