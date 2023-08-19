import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: "dpjozw1nb", 
  api_key: 851518668842429, 
  api_secret: "olamideisgoat", 
});

export const cloudinaryUploadimg = async (fileToUploads) => {
    return new Promise((resolve) =>  {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secure_url
                },
                {
                    resource_type: "auto"
                }
            )
        })
    })
}