/**
 * Express server
 *
 */
import express, { Application } from "express";
import { rateLimit,  } from "express-rate-limit";
import 'express-async-errors';
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss";
import cors from "cors";

import userRouter from './routes/users';

const app: Application = express();

// rate limit options
const rateLimiter = rateLimit({
  windowMs: 60 * 6000, // 1 hour
  limit: 3000, 
  message:
    "Too many request from this Ip address. Please try again in one hour",
});

// allowable methods
const allowMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: allowMethods,
  })
);   

app.use(express.json({ limit: "10kb" }));
app.use(helmet()); // provide or add more response headers for security
app.use(rateLimiter); // rate limiting

// routes
app.use("/users", userRouter);

//logging only in dev mode
if (process.env.NODE_ENV === "development") app.use(morgan("tiny"));



export default app;
