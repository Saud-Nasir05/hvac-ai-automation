import { asyncHandler } from '../utils/asyncHandlerUtility.js';
import ErrorHandler from '../utils/errorHandlerUtility.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../db/supabase.js';
// controllers/testController.js


// Basic Home Route Controller
export const getHome = (req, res) => {
  res.json({ message: 'HVAC AI Backend is running smoothly 🚀' });
};

// Database Test Controller
export const testDbConnection = async (req, res) => {
  try {
    const { data, error } = await supabase.from('vendors').select('*');
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Database Connected Successfully!', data });
  } catch (error) {
    res.status(500).json({ error: 'Server error while connecting to database' });
  }
};

// 1. REGISTER VENDOR
export const register = asyncHandler(async (req, res, next) => {
    const { company_name, email, password } = req.body;

    // 1. Check if user has entered all fields
    if (!company_name || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    // 2. Check if vendor with same email already exists
    const { data: existingVendor } = await supabase
        .from('vendors')
        .select('*')
        .eq('email', email)
        .single();

    if (existingVendor) {
        return next(new ErrorHandler("Vendor with this email already exists", 400));
    }

    // 3. Hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // 4. Save details in DB
    const { data: newVendor, error } = await supabase
        .from('vendors')
        .insert([{ 
            company_name, 
            email, 
            password_hash: hashedPass 
        }])
        .select()
        .single(); // .single() array ki bajaye seedha object return karta hai

    if (error) {
        return next(new ErrorHandler(error.message, 500));
    }

    // 5. Convert user id into token
    const tokenData = {
        id: newVendor.id
    };

    // Make sure .env mein JWT_SECRET aur JWT_EXPIRE (e.g., '7d') maujood hain
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    // 6. Set cookie and send response
    res.status(201)
        .cookie("token", token, {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        .json({
            success: true,
            message: "Registration successful",
            responseData: {
                user: { id: newVendor.id, company_name: newVendor.company_name, email: newVendor.email },
                token
            }
        });
});

// 2. LOGIN VENDOR
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
        return next(new ErrorHandler("Enter valid email and password", 400));
    }

    // 2. Find vendor by email
    const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('email', email)
        .single();

    if (!vendor || error) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // 3. Check if password is valid
    const isValidPass = await bcrypt.compare(password, vendor.password_hash);
    if (!isValidPass) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // 4. Convert id into token
    const tokenData = {
        id: vendor.id
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    // 5. Set cookies & send response
    res.status(200)
        .cookie("token", token, {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true, // Only set false if testing on HTTP localhost without HTTPS
            sameSite: 'None'
        })
        .json({
            success: true,
            message: "Login successful",
            responseData: {
                user: { id: vendor.id, company_name: vendor.company_name, email: vendor.email },
                token
            }
        });
});

// 3. LOGOUT VENDOR
export const logout = asyncHandler(async (req, res, next) => {
    // Clear cookie
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }).json({
        success: true,
        message: "Logout successful"
    });
});

// 4. GET MY PROFILE (Protected Route)
export const getMyProfile = asyncHandler(async (req, res, next) => {
    // req.user.id humein isAuth middleware se mil raha hai
    const { data: vendor, error } = await supabase
        .from('vendors')
        .select('id, company_name, email, created_at') // Password hash nahi mangwa rahe security ke liye
        .eq('id', req.user.id)
        .single();

    if (error || !vendor) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user: vendor
    });
});