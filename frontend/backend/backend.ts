'use client'
import axios, { AxiosError, AxiosResponse } from "axios"
import { error } from "console"
import { json } from "stream/consumers"

axios.defaults.withCredentials=true
axios.defaults.baseURL=process.env.NEXT_PUBLIC_URL
axios.defaults.headers.common['Content-Type'] = 'application/json';     
export interface userDetails {email:string,password:string}
export interface ApiResponse<T> {data:T,error:string,toast?:string,success:boolean}

export async function Auth(data:userDetails,login:boolean):Promise<ApiResponse<null>>{
    const req = await axios.post<ApiResponse<null>>(login ? "/auth/login": "/auth/signup", data);
    return req.data;
}
