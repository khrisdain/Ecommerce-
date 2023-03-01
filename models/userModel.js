import mongoose from "mongoose";
import bcrypt from 'bcrypt';
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

userSchema.pre('save', async function (next){ //pre middleware executes one after another 
    const salt = await bcrypt.genSaltSync(10);
    this.password= await bcrypt.hash(this.password, salt)
})

mongoose.set("strictQuery", false)
//Export the model
const User = mongoose.model('User', userSchema);

export default User;