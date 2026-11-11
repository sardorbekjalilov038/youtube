import osFile from "../utils/file-system.js"
import { extname, join } from "path"
import argon from "argon2"
import jWT from "jsonwebtoken"

const register = async (req,res) => {
    const { username, password } = req.body
    const { profile } = req.files
    
    const filename = Date.now() + extname(profile.name)

    const users = osFile.read("users")
    let hashPass = await argon.hash(password)

    let existUser = users.find(user => user.username == username)

    let allowFileType = ("jpg","jpeg","png","svg")

    if(allowFileType.includes(extname(profile.name))){
        return res.status(415).json({
            status:415,
            message:UnSupportedMediaType
        })  
    }
    if(existUser){
        return res.status(409).json({
            status:409,
            message:"User already exist with this username"
        })
    }
    
    const newUser = {
        id:users.length ? users.at(-1).id + 1 : 1,
        username,
        password : hashPass,
        profile_img:filename
    }   

    users.push(newUser)
    osFile.write("users",users)

    profile.mv(join(process.cwd(),"src","uploads",filename),(err) =>{
        if(err){
            console.log(err)
        }
    })

    return res.status(201).json({
        status:201,
        message:"User successfully register!",
        accessToken:jWT.sign({id:newUser.id,username:newUser.username,role:"ADMIN"},process.env.JWT_SECRET,{expiresIn:"30m"}),
        refrshToken:jWT.sign({id:newUser.id,username:newUser.username,role:"ADMIN"},process.env.JWT_SECRET,{expiresIn:"1h"})
    })

}


const login = async(req, res) => {
    const { username, password } = req.body

    const users = osFile.read("users")

    let existUser = users.find(user => user.user == username)

    if(!existUser){
        return res.status(404).json({
            status:404,
            message:"Uusername or password wrong"
        })
    }

    if (!argon.verify(existUser.password,password)){
        return res.status(404).json({
            status:404,
            message:"Uusername or password wrong"
        })
    }

    return res.status(201).json({
        status:201,
        message:"User successfully login!",
        accessToken:jWT.sign({id:existUser.id,username:existUser.username,role:"ADMIN"},process.env.JWT_SECRET,{expiresIn:"30m"}),
        refrshToken:jWT.sign({id:existUser.id,username:existUser.username,role:"ADMIN"},process.env.JWT_SECRET,{expiresIn:"1h"})
    })
}


export default{
    register,
    login
}