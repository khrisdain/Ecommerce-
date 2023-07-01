import mongoose from "mongoose";

const brandCategorySchema = new mongoose.Schemea(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
    },
    {
        timestamps: true,
    }
)

const Brand = mongoose.model("Brand", brandCategorySchema);

export default Brand;