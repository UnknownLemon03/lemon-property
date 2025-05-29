'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useState } from "react"
import Link from "next/link"
import { Auth, userDetails } from "@/backend/backend"
import { redirect, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Router } from "next/router"
import axios, { AxiosError } from "axios"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [login,setLogin] = useState(false);
  const [stopForm,setStopForm] = useState(false);
  const router = useRouter()
  async function handleSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setStopForm(true)
    const formData = new FormData(e.currentTarget);
    const data = {
      email:formData.get('email'),
      password:formData.get('password'),
    } as userDetails
    if(!data.email || !data.password){
      toast.error("Please fill all fields")
      setStopForm(false)
      return;
    }
    try{
      let req = await Auth(data,login);
      if(req.success){
        toast.success(req.data)
        return router.push("/")
      }else{  
        toast.error(req.error)
      }
    }catch(e){
      if(axios.isAxiosError(e) && e.response) {
        toast.error(e.response.data.error || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    }finally{
      setStopForm(false)
    }

  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{login ? "Login" : "Sign up" }</CardTitle>
          <CardDescription>
            {login ? "Login to your account" : "Create a Account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 ">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" placeholder="Password" type="password" required />
              </div>
              <Button type="submit" disabled={stopForm} className="w-full">
   
                {!stopForm && (login ?  "Login":"Sign up")}
                {stopForm &&  "Loading...."}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm select-none w-full">
              Don&apos;t have an account?{" "}
              <span onClick={()=>setLogin(e=>!e)} className="underline underline-offset-4 cursor-pointer">
                {login?"Sign Up":"Login"}
              </span>
            </div>
            <div className="mt-4 text-center text-sm select-none w-full">
              <Link href={"/"} onClick={()=>setLogin(e=>!e)} className="underline underline-offset-4 cursor-pointer">
                  Go back
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
