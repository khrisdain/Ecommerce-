import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv";

dotenv.config()
          
cloudinary.config({ 
  cloud_name: "dpjozw1nb", 
  api_key: "851518668842429", 
  api_secret: "VqvaLUxC06KULpLNheuU1f-PvKQ", 
});

export const cloudinaryUploadimg = async (fileToUploads) => {
    return new Promise((resolve) =>  {
        cloudinary.uploader.upload(fileToUploads, (results) => {
            resolve(
                fileToUploads
            )
        });
        })
}