require("dotenv").config();

const connectDB = require("./config/db");
const app = require("./app");

const port = process.env.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`app listening on port: ${port}`);
  });
};

startServer();
