import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { clearAllNotification, delteNotification, getNotification } from "../controllers/notification.controllers.js";

const notificationRouter=express.Router()

notificationRouter.route("/get").get(verifyJWT,getNotification)
notificationRouter.route("/deleteone/:id").delete(verifyJWT,delteNotification)
notificationRouter.route("/").delete(verifyJWT,clearAllNotification)

export default notificationRouter