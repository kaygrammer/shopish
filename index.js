const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const connectDB = require("./config/dbConnect")
const authRouter = require("./routes/authRoute")

app.use("/", (req, res) => {
    res.send("hello world");

})

app.use("api/user", authRouter)

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
  