import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/common/config/db.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  //Connect to database
  await connectDb();
  app.listen(PORT, () => {
    console.log(
      `Server is running at port ${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
};

start().catch((error) => {
  console.error("failed to start server", error);
  process.exit(1);
});
