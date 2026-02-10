import jwt from "jsonwebtoken";

export const isLoggedIn = async (req , res , next) => {
    try{
        console.log(req.cookies);

        const{token} = req.cookies;

        console.log("Token found :", token ? "yes" : "No");

        if(!token){
            console.log("NO Token");
            return res.status(401).json({
                success : false,
                message : "authentication failed"
            })
        }

        const decoded = jwt.verify(token , process.env.SECRET_KEY)

        console.log(decoded);

        req.user = decoded;

        next();
    }catch(error){
        console.log("auth middleware failure");
        return res.status(401).json({
            success : false ,
            message : "Internal server error"
        })
    }

    
    
}