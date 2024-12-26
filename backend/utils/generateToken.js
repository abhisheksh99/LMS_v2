import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30* 24 * 60 * 60 * 1000, 
    })
    .json({
      success: true,
      message,
      user,
    });
};