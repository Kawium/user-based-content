import express from "express";
import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js";
import cookieSession from "cookie-session";
import mongoose from "mongoose";
import cors from "cors";

const MONGODB_URI =
  "mongodb+srv://mong:mongo@cluster0.y26ng.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();
const port = 4000;
const host = "localhost";

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(
  cookieSession({
    secret: "aVeryS3cr3tK3y",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "strict",
    httpOnly: true,
    secure: false,
  })
);

app.use("/", (req, res, next) => {
  console.log(req.session);
  next();
});

app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
