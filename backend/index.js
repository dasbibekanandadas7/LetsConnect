import express from "express";
import connectDB from "./database/db.js";
import app from "./app.js"

import dotenv from 'dotenv';
dotenv.config();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection error: ", err);
})