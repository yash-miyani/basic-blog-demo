require("dotenv").config();
const express = require("express");
const cors = require("cors")
const morgan = require("morgan");
const { connectMongoDB } = require("./connection");
const errorHandler = require("./utils/errorHandler");
const postRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");


const app = express();
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

process.on("uncaughtException", (err) => {
  console.error("uncaught exception", err);
  process.exit(1);
});

app.use(express.json());
const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

if (NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send(`${PORT} running...`);
});

app.use(`/api/posts`, postRouter);
app.use(`/api/auth`, authRouter);

// Global error handler
app.use(errorHandler);

connectMongoDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });