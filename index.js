const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnect")
const authRouter = require("./routes/authRoute")
const productRouter = require("./routes/productRoute")
const {notFound, errorHandler} = require("./middlewares/errorHandler")
const bodyParser = ("body-parser")
const cookieParser = require("cookie-parser")
const morgan = require('morgan') // list actions


app.use(morgan("dev"))
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use(notFound);
app.use(errorHandler);

port = process.env.PORT || 4000;

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      console.log(`Database connected successfully`)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
start();
  