import express from "express";
import authRouter from "./routes/auth.routes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import connectionRouter from "./routes/connection.routes.js";


const app=express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json({limit: "16kb"})); 

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
})) 
 app.use(express.static("public"));
app.use(cookieParser());


app.use("/api/v1/auth", authRouter)

//protected paths
app.use("/api/v1/user",userRouter)
app.use("/api/v1/post",postRouter)
app.use("api/v1/connection",connectionRouter)




// Error-handling middleware (must come after all routes)
app.use((err, req, res, next) => {
    console.error(err); // logs the error

    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    
    let errors = [];
  if (err.name === "ValidationError") {
    errors = Object.values(err.errors).map((el) => el.message);
  }
   
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors
    });
});


export default app;