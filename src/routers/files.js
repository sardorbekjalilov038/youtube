import express from "express"
import fileController from "../controllers/files.js"
import {checkToken} from "../middleware/check-token.js"

const router = express.Router()

router
    .post("/api/v1/file",checkToken,fileController.createFile)

export default router