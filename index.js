const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan");
const connectDb=require("./config/db")
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const { forgetPasswordContoller } = require("./controllers/authController");


dotenv.config();
connectDb()


const app= express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'))



app.use("/api/auth",authRoutes)
app.use('/api/user/forget-password',forgetPasswordContoller)
app.use(errorMiddleware)
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`Server connected with Port Number ${PORT}`);
})