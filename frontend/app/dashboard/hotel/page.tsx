"use client";
import { DeleteProperty, usePropertyCreate } from "@/backend/backend";
import { FilterProperties, IProperty } from "@/backend/types";
import { DialogDemo } from "@/components/Dialog";
import FullPropertyCard from "@/components/FullPropertieCard";
import NavBarMain from "@/components/NavBarMain";
import PropertyForm from "@/components/NewPropertie";
import PropertieCard from "@/components/PropertieCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { fsyncSync } from "fs";
import Image from "next/image";
import {
  use,
  useContext,
  useEffect,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";

export default function page() {
  const [data, setFilter] = usePropertyCreate({ userProperty: true });
  function doFilterRefresh() {
    setFilter((prev) => ({ ...prev }));
  }

  async function handlerDelete(id: string) {
    const req = await DeleteProperty(id);
    if (req.success) {
      if (req.toast) {
        toast.success(req.toast);
      } else {
        toast.success("Property deleted successfully");
      }
      setFilter((prev) => ({ ...prev }));
    } else {
      toast.error(req.error || "Failed to delete property");
    }
  }

  return (
    <>
      <h3 className="text-2xl ml-[1%] md:ml-[2%] lg:ml-[5%] mb-3 font-semibold text-gray-600">
        Manage Your Properties
      </h3>
      <div className="h-full flex justify-start items-center flex-col ">
        <DialogDemo className="my-5" name="Add New Property">
          <PropertyForm />
        </DialogDemo>
        {data.length == 0 && (
          <Image
            src={"/empty.svg"}
            className="mt-[5%]"
            alt="Empty"
            height={800}
            width={800}
          />
        )}
        {data.length > 0 && <SearchBar setFilter={setFilter} />}
        <div className="flex justify-center  items-center flex-wrap lg:mx-30 md:mx-2 ">
          {data.map((e, i) => (
            <PropertieCard data={e} key={i}>
              <div className="px-5 pb-5 flex justify-around">
                <DialogDemo
                  variant={"secondary"}
                  className="cursor-pointer"
                  name="Edit Property"
                >
                  <PropertyForm
                    doFilterRefresh={doFilterRefresh}
                    existingData={e}
                  />
                </DialogDemo>

                <Button variant={"destructive"} className="cursor-pointer">
                  Delete
                </Button>
              </div>
            </PropertieCard>
          ))}
        </div>
      </div>
    </>
  );
}
