import { asyncHandler } from "../utils/asyncHandlerUtility.js";
import ErrorHandler from "../utils/errorHandlerUtility.js"; // Capital 'E'
import jwt from 'jsonwebtoken';

export const isAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return next(new ErrorHandler("Bhai, token gayab hai! Please login karein.", 401));
    }

    // Verify Token (Make sure .env mein variable ka naam yahi ho)
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = tokenData;
    //console.log("Token Data:", tokenData);
    
    next();
});