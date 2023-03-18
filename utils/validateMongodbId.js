//Check for MongoDb validity 
import mongoose from "mongoose";

export const validateMongoDBId = ( id ) => {
    const isValid = mongoose.SchemaType.ObjectId.isValid(id);
    if( !isValid ) throw new Error("This is not a valid id")
}