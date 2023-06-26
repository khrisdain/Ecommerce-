import mongoose from "mongoose";

const dbConnect = () => {
    try{
        const connection = 'mongoose.connect(process.env.MONGODB_URl)';
        console.log("Database connected sucessfully")
    }catch(error){
        console.log("Database error")
    }
}

export default dbConnect;