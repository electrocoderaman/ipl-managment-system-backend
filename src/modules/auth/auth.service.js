import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../../common/config/email.js";
import imagekit from "../../common/config/imagekit.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utlis.js";
import User from "./auth.model.js";

import crypto from "crypto";
import fs from "node:fs";

const hashToken = (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  return hashedToken;
};

const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already exists");

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });

  try {
    await sendVerificationEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.verificationToken;

  return userObj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user)
    throw ApiError.unauthorized(
      "cant find the email in the db , suggesting to login again",
    );

  const isMatch = await user.comparePassword(password);

  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  if (!user.isVerified) {
    throw ApiError.forbidden("please varify your email before loggin");
  }

  const acessToken = await generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);

  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, acessToken, refreshToken };
};

const refresh = async (token) => {
  if (!token) throw ApiError.unauthorized("Refresh token missing");

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) throw ApiError.unauthorized("user not found");

  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, refreshToken, accessToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("user not found by this id");

  return user;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("No account with that email");

  const { rawToken, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send reset email:", err.message);
  }
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) throw ApiError.badRequest("Invalid or expired reset token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};
const verifyEmail = async (token) => {
  const hashedToken = hashToken(token);
  const user = await User.findOne({ verificationToken: hashedToken }).select(
    "+verificationToken",
  );
  if (!user) throw ApiError.unauthorized("cant find the user");

  user.isVerified = true;

  user.verificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  return user;
};

const uploadAvatar = async (userId, file) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw ApiError.unauthorized("user not found with this id");

    const fileStream = fs.createReadStream(file.path);
    const uploadResponse = await imagekit.files.upload({
      file: fileStream,
      fileName: file.filename,
      folder: "/users-avatars",
    });

    user.avatar = uploadResponse.url;
    user.save({ validateBeforeSave: false });

    fs.unlinkSync(file.path);

    return {
      url: uploadResponse.url,
      fileID: uploadResponse.fileId,
    };
  } catch (error) {
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.log("Error deleting temp file: ", error);
    }
  }
};

export {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  verifyEmail,
  uploadAvatar,
};
