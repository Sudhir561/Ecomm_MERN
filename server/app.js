const express=require('express');
const app=express();
require('dotenv').config();
require('./db/conn')
const cors=require('cors');


const port=4009;

app.use(cors());
app.use(express.json());

//admin routes
const adminAuthRoutes=require('./routes/admin/adminAuthRoutes');
app.use('adminauth/api',adminAuthRoutes);



app.get('/',(req,res)=>{
    res.status(200).json('welcome')
})

app.listen(port,()=>{
    console.log(`server started at ${port}`)
})


