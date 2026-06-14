import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

const register = async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, "Registration success", user);
  //something
};

const login = async (req, res) => {
  const { user, acessToken, refreshToken } = await authService.login(req.body);
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .cookie("acessToken", acessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
  ApiResponse.ok(res, "login successful", {
    user,
    accessToken: acessToken,
    refreshToken,
  });
};

const logout = async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie("refreshToken").clearCookie("acessToken");

  ApiResponse.ok(res, "Logout success");
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "user profile", user);
};

const verifyEmail = async (req, res) => {
  const user = await authService.verifyEmail(req.params.token);
  ApiResponse.ok(res, "email verified", user);
};

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken } = await authService.refresh(token);
  ApiResponse.ok(res, "Token refreshed", { accessToken });
};

const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body.email);
  ApiResponse.ok(res, "Password reset email sent");
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  ApiResponse.ok(res, "Password reset successful");
};

const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return ApiError.badRequest(
        "No file uploaded, please send file with avatar",
      );
    }

    const result = await authService.uploadAvatar(req.user.id, file);

    ApiResponse.ok(res, "Avatar uploadeed successfully", {
      avatarURL: result.url,
    });
  } catch (error) {
    console.log("Upload error", error);
    throw ApiError.internal(error.message || "Failed to upload avatar");
  }
};

export {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  uploadAvatar,
};
