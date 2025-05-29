import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Varela } from "next/font/google";
export function DialogDemo({
  children,
  name,
  className = "",
  variant = "default",
}: {
  name: string;
  children?: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={` h-full overflow-y-scroll overflow-x-clip scrollbar-hide  sm:max-w-fit bg-transparent border-0 shadow-none`}
      >
        <DialogTitle></DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
