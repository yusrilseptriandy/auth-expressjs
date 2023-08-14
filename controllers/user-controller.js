import users_model from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userModel = users_model;

//GET ALL USERS
export const GetUsers = async (req, res) => {
  try {
    const result = await userModel.findAll({
      attributes: ["id", "email", "name"],
    });
    res.status(200).json({ result });
  } catch (e) {
    console.error(e);
  }
};

//REGISTER AUTH
export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword) {
    return await res
      .status(400)
      .json({ message: "Confirm password is incorrect" });
  }

  const saltRounds = 10;
  const hastPassword = await bcrypt.hash(password, saltRounds);

  try {
    const result = await userModel.create({
      name,
      email,
      password: hastPassword,
    });
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
  }
};

//LOGIN AUTH
export const Login = async (req, res) => {
  // const { email } = req.body;

  try {
    const user = await userModel.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "email or password is wrong" });
    }
    //COMPARE PASSWORD
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //CEK PASSWORD
    if (!passwordMatch) {
      return res.status(400).json({ message: "password is wrong" });
    }

    const userId = user.id;
    const name = user.name;
    const email = user.email;

    const payload = {
      userId,
      name,
      email,
    };

    const accestToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const result = await user.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accestToken, result });
  } catch (e) {
    console.log(e);
  }
};

//LOGOUT AUTH
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(204).json({ message: "Refresh token not available" });

  const user = await userModel.findOne({
    refresh_token: refreshToken,
  });
  if (!user) return res.status(204).json({ message: "token expired" });

  const userId = user.id;
  await userModel.update(
    { refresh_token: null },
    {
      where: { id: userId },
    }
  );
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successfully" });
};
