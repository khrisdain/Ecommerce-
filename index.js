import express from "express";
import bodyParser from "body-parser"
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import blogRouter from "./routes/blogRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import blogCategoryRouter from "./routes/blogCategoryRouter.js";
import brandRouter from "./routes/brandRouter.js";
import couponRouter from "./routes/couponRouter.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {notFound, errorHandler} from "./middlewares/errorHandler.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })); //false prevents objects of objects 
app.use(cors()); //cross origin resource sahring 
app.use(cookieParser()); //

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogCategory", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);

app.use(notFound);
app.use(errorHandler)

//Server Listening
app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
});
