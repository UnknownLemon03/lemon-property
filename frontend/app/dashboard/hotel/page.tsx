"use client";
import { DeleteProperty, usePropertyCreate } from "@/backend/backend";
import { FilterProperties, IProperty } from "@/backend/types";
import { DialogDemo } from "@/components/Dialog";
import FullPropertyCard from "@/components/FullPropertieCard";
import NavBarMain from "@/components/NavBarMain";
import PropertyForm from "@/components/NewPropertie";
import PropertieCard from "@/components/PropertieCard";
import SearchBar from "@/components/SearchBar";
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
  const [data, setFilter] = usePropertyCreate(true);
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
      <div className="h-full flex justify-start items-center flex-col ">
        {data.length > 0 && <SearchBar setFilter={setFilter} />}
        <DialogDemo className="mt-5" name="Add New Property">
          <PropertyForm />
        </DialogDemo>
        <div className="flex justify-center items-center flex-wrap lg:mx-30 md:mx-2 ">
          {data.map((e, i) => (
            <PropertieCard
              edit={true}
              handleDelete={async () => {
                await handlerDelete(e._id);
              }}
              doFilterRefresh={doFilterRefresh}
              data={e}
              key={i}
            />
          ))}
        </div>
      </div>
    </>
  );
}
