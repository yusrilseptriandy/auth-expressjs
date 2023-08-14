import users_model from "../models/user-model.js";
import jwt from "jsonwebtoken";

const userModel = users_model;

export const RefreshToken = async (req, res) => {
  const userId = userModel.id;
  const name = userModel.name;
  const email = userModel.email;

  const payload = {
    userId,
    name,
    email,
  };
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "you must be logged in" });
    const user = await userModel.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) return res.status(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      function (err, decoded) {
        if (err) {
          err = {
            name: "JsonWebTokenError",
            message: "jwt malformed",
          };
        }

        const accestToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15s",
        });
        res.status(200).json({ accestToken });
      }
    );
  } catch (e) {
    console.log(e);
  }
};
