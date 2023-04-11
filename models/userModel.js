import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
// Declare the Schema of the Mongo mode
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
    role: {
        type: String,
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    address: { 
        type: String
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true
});
mongoose.set("strictQuery", false)


//password state logic
userSchema.pre('save', async function (next){ //pre middleware executes one after another 
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSaltSync(10);
    this.password= await bcrypt.hash(this.password, salt)
});

userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.createPasswordResetToken = async function(){
    const resettoken = crypto.randomBytes(32).toString('hex') //generates randomByte from crypto module
    this.passwordResetToken = crypto //store hashed token generated using sha-256 algorithm
        .createHash('sha256')
        .update(resettoken)
        .digest('hex')
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //30miutes to sec by 10^-3 to millisec.
    return resettoken;
}

//Export the model
const User = mongoose.model('User', userSchema);

export default User;