import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name : {
        type : "String"
    },

    email : {
        type : "String",
        required : true
    },

    password : {
        type : "string"
    },

    verificationToken : {
        type : "string"
    },

    isverified : {
        type : "boolean",
        default : false
    },

    resetpasswordtoken : {
        type : "string"
    },

    forgotpasswordtoken : {
        type : "string"
    },

    resettokenexpiry : {
        type : Date
    }


},{
    timestamps : true
})

const User = mongoose.model("User",userSchema);

export default User;