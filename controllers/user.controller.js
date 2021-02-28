const config = require("../configs/secret-key");
const db = require("../configs/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = db.user;

exports.Login = async (req, res) => {
  try {
    let users = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!users) {
      return res.status(400).send({
        success: false,
        message: "Username does not exist!",
      });
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, users.password); // check pass
    if (!passwordIsValid) {
      return res
        .status(200)
        .send({ success: false, message: "Password incorrect!" });
    }

    let JwtToken = jwt.sign({ id: users.id, role: users.role }, config.secret, {
      expiresIn: 86400, // token hết hạn sau 24 giờ
    });

    res
      .status(200)
      .send({
        success: true,
        data: JwtToken,
        userId: users.id,
        userEmail: users.email,
        userName: users.name,
      });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.Register = async (req, res) => {
  try {
    let checkUser = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (req.body.password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Required length password >= 8!",
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password different confirm password!",
      });
    }
    if (!checkUser) {
      let users = User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8), // mã hóa pass
        name: req.body.name,
        email: req.body.email,
        role: 2,
      });
      let JwtToken = jwt.sign(
        { id: users.id, role: users.role },
        config.secret,
        {
          expiresIn: 86400, // token hết hạn sau 24 giờ
        }
      );
      res.status(200).send({ success: true, message: JwtToken });
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Username exists!" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
