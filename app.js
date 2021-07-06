const https = require("https");
const fs = require("fs");

const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const { accessLogStream } = require("./helpers/logging");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

app.use(express.json({ limit: "1mb" }));
Sentry.init({
  dsn: process.env.SENTRY_URL,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
})
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }))

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Preparing your Code for Production 👩‍💻👨‍💻👨‍💻",
  });
});

app.post("/", (req, res, next) => {
  const {name} = req.body;
  if(!name) {
    const error = new Error("Name is Required.");
    error.statusCode = 404;
    throw error;
  }
  // doSomething(); //tigger error for Sentry
  res.status(200).json({
    success: true,
    name
  })
})

app.use(Sentry.Handlers.errorHandler());

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

https.createServer({key: privateKey, cert: certificate}, app).listen(port, () => {
  console.log(`Server started at https://localhost:${port}`);
});

/* app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
}); */

