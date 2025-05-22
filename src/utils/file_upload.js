/*
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs";


dotenv.config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath)
        return null
        const response= await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        //file uploaded successfully
        console.log("File uploaded successfully",response.url);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        //file deleted from local storage
    }
}
export {uploadOnCloudinary}*/
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        // File uploaded successfully
        console.log("File uploaded successfully:", response.url);
        
        // Delete the file from local storage after successful upload
        fs.unlink(localFilePath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });

        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        // Try deleting the file if upload fails
        try {
            fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
            console.error("Error deleting file after failure:", unlinkError);
        }

        return null;
    }
};

export { uploadOnCloudinary };
