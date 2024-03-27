const cloudinary=require('cloudinary').v2;

cloudinary.config({
    cloud_name: "soal",
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
  });

  module.exports=cloudinary