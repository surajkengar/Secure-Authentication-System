import express from "express";
import dotenv from "dotenv";
import dbconnect from "./utils/dbconnection.utils.js";
import router from "./route/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT =process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

dbconnect();

app.use("/api/v1/users" , router);




app.listen(PORT , ()=>{
    console.log(`server started on PORT ${PORT}`);
})
