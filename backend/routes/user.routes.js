import express from "express"
import {getCurrentUser, getProfile, getSuggestedUser, search, updateProfile} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from '../middleware/multer.middleware.js';

const userRouter=express.Router()

userRouter.route("/currentuser").get(verifyJWT, getCurrentUser)
userRouter.route("/updateprofile").patch(verifyJWT,
    upload.fields([
        {
            name:"profileImage",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),updateProfile)
userRouter.route("/profile/:username").get(verifyJWT, getProfile)
userRouter.route("/search").get(verifyJWT, search)
userRouter.route("/suggestedusers").get(verifyJWT, getSuggestedUser)

export default userRouter;