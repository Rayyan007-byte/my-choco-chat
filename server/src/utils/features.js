const fs = require("fs");
const path = require("path");
const {v4: uuid} = require('uuid');
const {v2: cloudinary} = require('cloudinary');
const { getBase64 } = require('../lib/helper');
const { exit } = require("process");
require('dotenv').config();
const emitEvent = (req, event, users, data) => {
  console.log("Emiting Event", event);
};

const cookiesOption = {
  maxAge: 1000 * 60 * 60 * 24 * 15,
  httpOnly: true,
  secure: true,
};
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFilesToCloudinary = async (files=[]) => {
  const uploadPromises = files.map(async(file) => {
    // check if cloudinary is configured
    if(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET){
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(getBase64(file), {
        resource_type: "auto",
        folder: "avatars",
        public_id: uuid()
      }, (error, result) => {
        if(error) return reject(error);
        resolve(result)
      })
    })
  }
   // Local fallback
    return new Promise(async(resolve, reject) => {
      try {
        const uploadsDir = path.join(__dirname, "../../uploads/avatar");
        

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir);
        }

        const ext = path.extname(file.originalname);
        const filename = `${uuid()}${ext}`;
        const filepath = path.join(uploadsDir, filename);

        // fs.writeFileSync(filepath, file.buffer);
        await fs.promises.writeFile(filepath, file.buffer);

        resolve({
          public_id: filename,
          secure_url: `/uploads/avatar/${filename}`,
        });

      } catch (err) {
        reject(err);
      }
    });
  })
  
  try {
    const results = await Promise.all(uploadPromises);
    const formattedResult = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url
    }))
    return formattedResult;
  } catch (error) {
    throw new Error("Error uploadingfiles to cloudinary", error);
    
  }
}

module.exports = { emitEvent, cookiesOption, uploadFilesToCloudinary };
