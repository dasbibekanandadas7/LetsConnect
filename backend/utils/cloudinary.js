import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

const initializeConfig = () => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
}

const uploadOnCloudinary = async (localFilePath) => {
    initializeConfig();
    
    try {
        if (!localFilePath) {
            console.error("uploadOnCloudinary called without localFilePath")
            return null}

        if (!fs.existsSync(localFilePath)) {
          console.error("uploadOnCloudinary: file does not exist:", localFilePath)
          return null
        }

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        try {
          if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath)
        } catch (unlinkErr) {
          console.warn("Could not remove temp file after upload:", unlinkErr.message)
        }
        console.log("inside cloudinary")
        return response;

    } catch (error) {
        try {
          if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath)
        } catch (unlinkErr) {
          console.warn("Could not remove temp file after upload error:", unlinkErr.message)
        }
        console.error("Cloudinary upload error:", error.message || error)
        return null;
    }
}



export {uploadOnCloudinary}