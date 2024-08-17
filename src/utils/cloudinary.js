import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'xcurxcloud', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
    
        const res = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        return res
    } catch (error) {
        return null
    }
}

export {uploadOnCloudinary}

