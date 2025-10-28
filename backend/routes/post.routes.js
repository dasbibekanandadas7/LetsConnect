import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import { createPost, getPost, like, comment } from "../controllers/post.controllers.js"

const postRouter=express.Router()

postRouter.route("/createpost").post(verifyJWT,upload.single("image"),createPost)
postRouter.route("/getpost").get(verifyJWT,getPost)
postRouter.route("/like/:id").get(verifyJWT,like)
postRouter.route("/comment/:id").post(verifyJWT, comment)

export default postRouter
