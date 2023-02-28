import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser"
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })); //false prevents objects of objects 
app.use(cors()); //cross origin resource sahring 

app.use("/api/user", authRouter)

app.use(notFound);
app.request(errorHandler)

//Server Listening
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
});
