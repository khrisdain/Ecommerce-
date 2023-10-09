import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                products: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product", //Refernces data from the product Model
                },
                count: Number,
                color: String,
                price: Number,
            },
        ],
            cartTotal: Number,  
            totalAfterDiscount: Number,
            orderby: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", //refrences data collection in the User model 
            },
    },
    {
        timestamps: true,
    }
);

//Export the model
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;