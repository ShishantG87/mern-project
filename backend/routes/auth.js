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
       if ( !email || !password) {
            return res
            .status(400)
            .json({message: "Please fill all the fields"})
        }
        const user = await User.findOne({email});


        if (!user || !(await user.matchPassword(password))) {
                     return res
                     .status(401)
                     .json({ message: "Invalid credentials" })                           
        } 
        const token = generateToken(user._id);
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (err) {
        res.status(500).json({message: "Server error"})
    }

})


router.put("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(401).json({message: "User not found"});
        

        if (req.body.email && req.body.email != user.email){ 
            const emailExists = await User.findOne({email: req.body.email});
            if (emailExists) {
                return res.status(400).json({message: "Email already in use"});
            }
            user.email = req.body.email;
        }
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;  
        
        const updated = await user.save();
        res.status(200).json({
            _id: updated._id,
            username: updated.username,
            email: updated.email,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.delete("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(401).json({message: "User not found"});

        await user.deleteOne();

        res.status(200).json({message: "User deleted"});

    } catch (error) {
        res.status(500).json({message: error.message});
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
