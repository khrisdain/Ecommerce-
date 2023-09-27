import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
    products: [
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        count: Number,
        color: String,
    },
    ],
    paymentIntent:{},
    orderStatus: {
        type: String,
        default: "Not processed",
        enum: [ //enumerate: specifically listed
            "Not processed",
            "Cash on delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered"
        ]
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true,
});

//Export the model
const Order = mongoose.model('Order', orderSchema);
export default Order