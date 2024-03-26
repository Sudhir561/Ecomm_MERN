const multer=require('multer');

// storage config

const storage =multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./adminuploads')
    },
    filename:(req,file,callback)=>{
        const filename=`image-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
});

//filter (allow only .png/ .jpeg  /  .jpg)
const filefilter=(req,file,callback)=>{
    if(file.mimetype==="image/png"||file.mimetype==="image/jpg"||file.mimetype==="image/jpeg"){
        callback(null,true)
    }
    else{
      
        return callback(new Error('only jpg,jpeg and png allowed'))
    }
}

const upload=multer({
    storage:storage,
    fileFilter:filefilter
})

module.exports=upload