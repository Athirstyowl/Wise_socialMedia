import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async(req,res) => {
    try{
        const{
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation
        } =  req.body;

        const salt = await bcrypt.genSalt(); 
        const passwordHash = await bcrypt.hash(password,salt);
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 20000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); //status code 201 means somethings created
    } 
    catch(error){
        res.status(500).json({error:err.message});
    }
};

// Logging in
export const login = async(req,res) => {
    try{
        const { email,password} = req.body;
        const user = await User.findOne({email:email}); 
        if(!user) return (
            //toast("User does not exist"),
            res.status(400).json({msg: "USer does not exist. "}));

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid Credentials. "});

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        delete user.password; // deleting the password so we dont send the password to the frontend
        res.status(200).json({token,user})
    }
    catch (err) {
        //toast("Something went wrong Try Again!"),
        res.status(500).json({ error: err.message });
      }
};

