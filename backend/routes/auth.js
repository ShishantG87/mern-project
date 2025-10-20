import express from "express";
import User from '../models/User.js';
import { protect } from "../middleware/auth.js";
import jwt from 'jsonwebtoken';


const router = express.Router();

//  Register
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({message: "Please fill all the fields"})
        }

        const userExists = await User.findOne({email});
        if (userExists) {
           return res
           .status(400)
           .json({message: "User already exists"});
        }

        const user = await User.create({username, email, password});
        const token = generateToken(user._id);
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
            });
    } catch (err) {
        res.status(500).json({message: "Server error"})

    }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt:", email); // Debug

        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatches = await user.matchPassword(password);
        console.log("Password match:", passwordMatches);

        if (!passwordMatches) {
            console.log("Password incorrect");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        console.log("Token generated:", token);

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (err) {
        console.error("Login route error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});



// Me 
router.get("/me", protect, async (req, res) => {
    res.status(200).json(req.user);
});

// Generate JWT token 
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}


export default router;
