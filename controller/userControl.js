import User from "../models/userModel.js";

export const createUser = async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if(!findUser) {
        //create a new user
        const newUser =await User.create(req.body) //Object-relational mapping to database /ODM 
        res.json(newUser)
    }else {
        throw new Error("User already exists")
    }
}
