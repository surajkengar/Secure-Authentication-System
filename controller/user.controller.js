
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const user =async (req , res)=>{
    try{
        console.log("registration started");
    // get data from the user name  , email , password
    const{name , email , password} = req.body;


    //validate all field are filled by the user

    if(!name || !email || !password){
        return res.status(400).json({
            message : "All field are required"
        })
    }

    // check if user already presented

    const existingUser = await User.findOne({email});

    if(existingUser){
        return  res.status(400).json({message : "user already Exist"});
    }

    // encrypt the password

    const hashPassword = await bcrypt.hash(password , 10);


    //cretae a token

    const verificationToken = crypto.randomBytes(32).toString("hex");

    //create a new user

    const newUser =await User.create({
        name,
        email,
        password : hashPassword,
        verificationToken : verificationToken
    })

    // send email to user

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: '"My App" <noreply@myapp.com>',
        to: newUser.email,
        subject: "Verify your email",
        text: `Please verify your account by clicking: http://localhost:5000/api/v1/users/verifiUser/${verificationToken}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
        success : true,
        message : "user successfully registered"
    })

    }catch(error){
        res.status(400).json({
            
            message : "user failed to registered",
            
        })
    }
}


const verifyUser = async (req , res)=>{
   try{
         const{token} = req.params;

    if(!token){
        return res.status(400).json({
            message : "invalid token"
        })
    }

    const existingToken = await User.findOne({verificationToken : token});

    if(!existingToken){
        return res.status(400).json({message : "user not found || token exipired"});
    }

    existingToken.isverified = true;
    existingToken.verificationToken = undefined;

    await existingToken.save();

    res.status(200).json({message : "user successfully verified"});

   }catch(error){
        
        res.status(500).json({message : "user not verified"});
        console.error(error.message);
   }

}

const login = async (req , res) => {
    try{
        const{email , password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message : "All field are required"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : "invalid email or password"});
        }

        if(!user.isverified){
            return res.status(401).json({
                message : "please verify email before login"
            })
        }

        const ismatch = await bcrypt.compare(password , user.password);

        if(!ismatch){
            return res.status(400).json({message : "invalid email or password"});
        }

        const token = jwt.sign(
            {id : user._id},
            process.env.SECRET_KEY,
            {expiresIn : "24h"}
        )

        const options ={
            httpOnly : true ,
            secure : false ,
            maxAge : 24 * 60 * 60 * 1000
        }

        res.cookie("token", token , options);

        res.status(200).json({
            success : true,
            message : "user login successfully",
            user : {
                name : user.name ,
                id : user.id,
                email :user.email
            }
    })
    }catch(error){
        res.status(500).json({
            message : "user failed to login",
        })
    }
    
}

const getme = async (req , res)=>{
    try{
        console.log("Reach at profile level");

        const user = await User.findById( req.user.id).select('-password');

        if(!user){
            return res.status(404).json({
                status : false,
                message : "invalid user"
            })
        }

        res.status(200).json({
            success : true,
            message : "user profile fetched successfully",
            user 
        })
    }catch(error){
        console.log("error :" ,error.message)
        res.status(500).json({
            success : false ,
            message : "server error"
        })
    }
}

const logout =async (req , res)=>{
    try{
        res.cookie("token" , "",{
            httpOnly : true,
            expires : new Date(0),
            secure : false,
            sameSite : "lax"
        })

        res.status(200).json({
            success : true,
            message : "user logout successfully"
        })
    }catch(error){
        res.status(500).json({
            messsage : "failed to logout"
        })
    }
}

const forgotpassword = async (req , res)=>{
    try{
    const{email} = req.body;

    if(!email){
        return res.status(400).json({
            message : "Email is required"
        })
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(200).json({
            message : "if account exist , reset link will be send to you registered emailId"
        })
    }

    const token = crypto.randomBytes(32).toString("hex");

    const hashedtoken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")

    user.resetpasswordtoken = hashedtoken;

    const Expiry = Date.now() + 15 * 60 * 1000;

    user.resettokenexpiry = Expiry;

    await user.save();

    const transporter =nodemailer.createTransport({
        host : "smtp.ethereal.email",
        port : 587,
        auth : {
            user : process.env.EMAIL_USER ,
            pass : process.env.EMAIL_PASS
        }
    })

    const mailOptions ={
        from : '"My App" <noreply@myapp.com>',
        to   : user.email ,
        subject : "RESET PASSWORD LINK",
        text : `please Reset your password by clicking:http://localhost:5000/api/v1/users/resetpassword/${token}`
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({
        success : true ,
        message : "if Account exist Reset password link  send to your registered emailId"
    })

    }catch(error){
        res.status(500).json({
            success : false,
            message : "failed to resetpassword link"
        })
    }

    

}

const resetpassword = async (req , res)=>{
    try{
    const {token} = req.params;
    const{password} = req.body;
    console.log(password);
    console.log(token);
    if(!password){
        return res.status(400).json({
            message : "password is required"
        })
    }

    const hashedtoken = crypto
                            .createHash("sha256")
                            .update(token)
                            .digest("hex")

    const user = await User.findOne({
         resetpasswordtoken : hashedtoken,
         resettokenexpiry   : {$gt : Date.now()}
    })

    if(!user){
        return res.status(400).json({
            success : false,
            message : "user not found"
        })
    }

    const hashpassword = await bcrypt.hash(password, 10);
    console.log(hashpassword);                  
    user.password = hashpassword;
    user.resetpasswordtoken = undefined;
    user.resettokenexpiry = undefined;

    await user.save();

    res.status(200).json({
        success : true ,
        message : "reset password successfully"
    })

    }catch(error){
        console.log(error);
        res.status(400).json({
            success : false ,
            message : "failed to reset password"
        })
    }
    
}



export {user , verifyUser , login , getme , logout , forgotpassword , resetpassword};