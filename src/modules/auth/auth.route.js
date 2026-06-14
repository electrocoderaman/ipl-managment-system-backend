import { Router } from "express";
import * as controller from "./auth.controller.js";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import { authenticate } from "./auth.middleware.js";
import LoginDto from "./dto/login.dto.js";
import ForgotPass from "./dto/forgot-password.dto.js";
import ResetPass from "./dto/reset-password.dto.js";
import { upload } from "../../common/middleware/multer.middleware.js";

const route = Router();

route.post("/register", validate(RegisterDto), controller.register);
route.post("/login", validate(LoginDto), controller.login);
route.post("/logout", authenticate, controller.logout);
route.get("/me", authenticate, controller.getMe);
route.get("/verify-email/:token", controller.verifyEmail);
route.post("/refresh-token", controller.refreshToken);
route.post("/forgot-password", validate(ForgotPass), controller.forgotPassword);
route.put(
  "/reset-password/:token",
  validate(ResetPass),
  controller.resetPassword,
);
route.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  controller.uploadAvatar,
);

export default route;
