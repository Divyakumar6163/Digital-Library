// cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'CloudinaryDemo', 
        allowed_formats: ['jpeg', 'png', 'jpg'], 
        public_id: (req, file) => file.originalname,
    },
});

module.exports = {
    storage,
};
