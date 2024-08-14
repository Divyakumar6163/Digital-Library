const userSchema = require('./../models/usermodel')

exports.getallusers = async (req,res)=>{
    try {
        const alluser = await userSchema.find(); 
        res.status(200).json({
            status: 'success',
            data :{
                alluser: alluser
            }
        })
    }
    catch(err){
        res.status(500).json({
            status: 'error',
            message: "Error While fetching data",
            error: err
        })
    }
}

exports.createUsers = async (req, res) => {
    try{
        console.log("hii......" + req.body);
        const neruser = await userSchema.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                user: neruser
            }
        })
    }
    catch(err){
        res.status(500).json({
            status: 'error',
            message: "Error while creating users",
            error: err
        })
    }
}

exports.getuserinfo = async (req,res)=>{
    try{
        const id = req.params.id;
        console.log(id)
        const userinfo = await userSchema.findById(id);
        console.log(userinfo)
        if(!userinfo){
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data :{
                userinfo: userinfo
            },
            message: "User info available",

        })
    }
    catch(err){
        res.status(500).json({
            status: 'error',
            message: "Error while fetching user details",
            error: err
        })
    }
}
