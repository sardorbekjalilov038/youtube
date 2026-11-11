import osFile from "../utils/file-system.js"
import { extname, join} from "path"

const createFile = (req,res) =>{
    const { title } = req.body
    const { file } = req.files

    let filename =Date.now() + extname(file.name)
    const files = osFile.read("files")

    const newFile ={
        id:files.length ? files.charAt(-1).id + 1 :1,
        title,
        file:filename,
        size: file.size / 1024 / 2024,
        userId: req.user.id,
        created_at:new Date().toLocaleDateString()
    }

    files.push (newFile)

    osFile.write("files",files)
    file.mv(join(process.cwd(),"src","uploads",filename),(err) =>{
        if(err){
            console.log(err)
        }
    })

    return res.status(201).json({
        status:201,
        message:"File added!"
    })
}

export default{
    createFile
}