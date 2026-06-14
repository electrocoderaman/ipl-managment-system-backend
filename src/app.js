import express from "express";
import cookieParser from "cookie-parser";
import route from "./modules/auth/auth.route.js";
import ApiResponse from "./common/utils/api-response.js";
import ApiError from "./common/utils/api-error.js";
import ownerRoute from "./modules/ipl-ms/routes/owner.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", route);
app.use("/api/owner", ownerRoute);

export default app;
