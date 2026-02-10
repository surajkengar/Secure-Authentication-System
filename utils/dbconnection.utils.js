import mongoose from "mongoose";


const dbconnect =async  ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected successfully");
    }catch(error){
        console.error("database connection failed");
        console.error(error.message);
        process.exit(1);
    }
    
}

export default dbconnect;

