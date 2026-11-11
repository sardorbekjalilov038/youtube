import express from "express"
import dotenv from "dotenv"
import userRouter from "./routers/users.js"
import fileRouter from "./routers/files.js"
import fileUpload from "express-fileupload";

dotenv.config()

const app = express()
app.use(express.json())
app.use(fileUpload())

app.use(userRouter)
app.use(fileRouter)

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."))