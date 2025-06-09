// This is a simple check to ensure your main file is correctly set up
// You should have something similar to this in your actual index.js

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// Import your routes here
// import userRouter from './routes/user.routes.js';
// import videoRouter from './routes/video.routes.js';

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
)

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Routes
app.get("/api/healthcheck", (req, res) => {
  res.status(200).json({
    message: "Server is up and running!",
    timestamp: new Date().toISOString(),
  })
})

// Register your route handlers
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/videos", videoRouter);

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`⚡️ Server is running on port ${PORT}`)
})

export default app
