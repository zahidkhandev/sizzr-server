const express = require("express");
const mongoose = require("mongoose");
const app = express();
const createError = require("http-errors");
require("dotenv").config();
require("express-async-errors");

//ROUTES IMPORT
const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/users");
const adminAuthRoute = require("./src/routes/adminAuth");
const adminRoute = require("./src/routes/admin");
const newStoreRoute = require("./src/routes/newStore");
const vendorAuthRoute = require("./src/routes/vendorAuth");
const vendorRoute = require("./src/routes/vendor");
const appointmentsRoute = require("./src/routes/appointments");
const artistRoute = require("./src/routes/artist");
const artistAuthRoute = require("./src/routes/artistAuth");
const reviewsRoute = require("./src/routes/review");

// error handler
const notFoundMiddleware = require("./src/middleware/not-found");
const errorHandlerMiddleware = require("./src/middleware/error-handler");

//Security packages
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const ratelimiter = require("express-rate-limit");

//SWAGGER
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//Security Config
app.set("trust proxy", 1);
app.use(
  ratelimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(cors());
app.use(helmet());
app.use(xss());

//connect db
const connectDB = require("./src/db/connect");

app.get("/", (req, res) => {
  res.send(
    `
        <img src='https://sizzr.in/_next/image?url=%2Fimages%2FLogo.png&w=1920&q=75'>
        <h1> Sizzr Api</h1>
        <a href='/docs'>View documentation</a>
        `
  );
});

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//--------ROUTES---------

//User
app.use("/api/users", userRoute);
app.use("/api/users/auth", authRoute);
//Store
app.use("/api/new-store/create", newStoreRoute);
//Admin
app.use("/api/lucky", adminRoute);
app.use("/api/lucky/auth", adminAuthRoute);
//Vendor
app.use("/api/store/auth", vendorAuthRoute);
app.use("/api/store", vendorRoute);
//Artist
app.use("/api/artist", artistRoute);
app.use("/api/artist/auth", artistAuthRoute);
//Appointments
app.use("/api/appointments", appointmentsRoute);
//Reviews
app.use("/api/reviews", reviewsRoute);

//ERROR HANDLER

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("db conneted");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
