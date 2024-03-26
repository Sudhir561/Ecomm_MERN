
//register controller
exports.Register=async(req,res)=>{
  console.log(req.body);
  console.log(req.file);
  res.status(200).json("file-uploaded")
}