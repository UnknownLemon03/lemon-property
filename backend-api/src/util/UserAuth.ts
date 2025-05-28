// import jwt from "jsonwebtoken"
import jwt from "jsonwebtoken"
import User, { UserType } from "../Models/User";
import { Request } from "express";
import bcrypt from "bcrypt";
interface UserSession {
    id:number
    iat:number
}

export function CreateJWTSession(e:UserType){
    const data = {
        id:e._id,
    }
    return jwt.sign(data,process.env.JWT_SECRETE!,{expiresIn:"12h"});

}

export function isLogin(req:Request){
    const token = req.cookies.AUTH as string ?? null;
    if(token){
        const res = jwt.verify(token,process.env.JWT_SECRETE!) as UserSession
        return res;
    }
    return null;
}



export async function GetUser(req:Request){
    const session = isLogin(req);
    if(session){
       // find user and get user 
       return await User.findById(session.id)
    }
    // no user found    
    return null;
}


export async function CreateUser({email,password}:{email:string,password:string}):Promise<UserType|null>{
    try{
        const passwordHashed = await bcrypt.hash(password,12);
        const user = await User.create({
            email,
            password:passwordHashed
        })
        return user.save();
    }catch(e){
        return null
    }
}

// export async function isAdmin(id?:number){
//     let nid;
//     if(!id){
//         const data = await isLogin();
//         if(!data) return false;
//         nid = data.id;
//     }else{
//         nid = id
//     }
//     const {data:Role} = await GetRole({id:nid})
//     if(!Role) return false;
//     return true;
// }

// export async function isRoomAdmin(id?:number){
//     let nid ;
//     if(!id){
//         const data = await isLogin();
//         if(!data) return false;
//         nid = data.id
//     }else 
//         nid = id;
//     const req = await prisma.roomcontrol.findFirst({where:{userid:nid}})

//     return !req ? false : true;
// }

// export async function isRoomAdminCheck(){
//      const islogin = await isLogin()
//     if(!islogin) return redirect("/login")
//     const isroomadmin = await isRoomAdmin(islogin.id);
//     if(!isroomadmin) redirect("/dashboard");
// }

// export  async function checkRoomAccess(roomid:number,userid:number){
//     const req = await prisma.roomaccess.findFirst({
//         where:{
//             AND:{
//                 roomid,
//                 userid
//             }
//         }
//     })
//     console.log(req,"room access");
//     if(req) return true;
//     return false;
// }

// export async function getAuthToken(){
//     const cookie = await cookies();
//     const req = cookie.get("AUTH");
//     if(!req) return null;
//     return req.value;
// }