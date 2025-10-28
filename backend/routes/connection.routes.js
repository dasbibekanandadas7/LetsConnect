import express from "express"
import { sendConnection } from "../controllers/connection.controllers.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const connectionRouter=express.Router()

connectionRouter.route("/send/:id").get(sendConnection)

export default connectionRouter