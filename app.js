const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

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
