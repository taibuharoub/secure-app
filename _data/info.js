const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors")
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

//Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10mins
    max: 100 // 1 for testing
  })
  app.use(limiter);

//Prevent http params pollution
app.use(hpp());


//Enable CORS
app.use(cors());

//Prevent XSS attacks
app.use(xss());


//Secure response headers
app.use(helmet());

const scriptSrcUrls = [
  "https://mighty-lowlands-40859.herokuapp.com/"
]

app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'"],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'"],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:"
          ],
          fontSrc: ["'self'"],
      },
  })
);

//Sanitize data
app.use(mongoSanitize());