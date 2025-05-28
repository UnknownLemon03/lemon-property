import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Home ,Hotel,LogOut,MessageCircle,User} from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const items = [
        {title:"home",url:"/",icon:User},
        {title:"Manage Hotel",url:"/dashboard/hotel",icon:MessageCircle},
        {title:"Recommendations",url:"/dashboard/recommend",icon:Hotel},
        {title:"Logout",url:"/",icon:LogOut},
    ]
  return (<>
    <SidebarProvider >
      <>
        <Sidebar>
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel className="text-2xl my-2">Application</SidebarGroupLabel>
            <SidebarGroupContent >
                <SidebarMenu >
                {items.map((item,index) => (
                    <SidebarMenuItem key={index} className="py-1 pl-2 ">
                    <SidebarMenuButton asChild >
                        <Link href={item.url} className=" text-center" >
                        <item.icon className="mr-3"  style={{transform:"scale(1.5)"}} />
                        <span className="text-lg">{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem >
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        </Sidebar>
      </>
        <SidebarTrigger style={{transform:"scale(1.5)",margin:"4px 2px 2px 4px" }} />
        <div className="ml-1">
          {children}
        </div>
    </SidebarProvider>
  </>
  );
}
