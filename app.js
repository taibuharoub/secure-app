const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const { accessLogStream } = require("./helpers/logging");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }))

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Preparing your Code for Production 👩‍💻👨‍💻👨‍💻",
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
