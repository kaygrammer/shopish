const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnect")
const authRouter = require("./routes/authRoute")
const {notFound, errorHandler} = require("./middlewares/errorHandler")
const bodyParser = ("body-parser")
const cookieParser = require("cookie-parser")


app.use(express.json());
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use(notFound);
app.use(errorHandler);

port = process.env.PORT || 4000;

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
start();
  