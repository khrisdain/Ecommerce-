import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                products: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                count: Number,
                color: String,
                price: Number,
            },
            {
                totalAfterDiscount: Number,
                orderby: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

//Export the model
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;