'use client';
import React, { useEffect } from 'react'
import { Sheet, SheetTrigger, SheetContent ,SheetTitle} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon, MountainIcon } from 'lucide-react'
import Link from 'next/link'
import { isLogin } from '@/backend/utils';
export default function NavBarMain() {
  const [login,setLogin] = React.useState(false);
  useEffect(() => {
    setLogin(isLogin());
  }, []);
  let link = [
    (login ?  {name:"Dashboard",link:"/dashboard"} : {name:"Login/SignUp",link:"/auth"} )
  ]
  return (
    <>
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <div className="grid gap-2 py-6 pl-2">
            {link.map((e,i)=><Link key={i} href={e.link} className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              <SheetTitle>
                  {e.name}
              </SheetTitle>
            </Link>)}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6">
        {link.map((e,i)=><Link
          href={e.link}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
          key={i}
        >
          {e.name }
        </Link>)}
      </nav>
    </header> 
    </>
  )
}
