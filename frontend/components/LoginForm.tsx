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
import { useState } from "react"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [login,setLogin] = useState(false);


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            {login ? "Login to your account" : "Create a Account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6 ">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" placeholder="Password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                {login?"Sign Up":"Login"}
              </Button>
              <Button variant="outline" className="w-full">
                {login?"Sign Up":"Login"} with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm select-none w-full">
              Don&apos;t have an account?{" "}
              <span onClick={()=>setLogin(e=>!e)} className="underline underline-offset-4 cursor-pointer">
                {login ? "Sign up" : "Login"}
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
