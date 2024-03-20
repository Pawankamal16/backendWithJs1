import {v2 as cloudinary} from "cloudinary"  // give custom name v2
import fs from "fs"

//import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"  //images,videos
        })
        //file has been uploaded succesfully
        //console.log("file is uploaded on cloudinary",    response.url)
        
        fs.unlinkSync(localFilePath)
        return response;
    }catch(error){
         fs.unlinkSync(localFilePath)
         //remove the locally saved temporary file as the upload operaton got failed
         return null;
        }
}

export{uploadOnCloudinary}

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });