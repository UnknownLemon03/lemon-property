"use client";
import { PropertyFetch, usePropertyCreate } from "@/backend/backend";
import { IProperty } from "@/backend/types";
import { DialogDemo } from "@/components/Dialog";
import FavoriteSend from "@/components/FavoriteSend";
import FullPropertyCard from "@/components/FullPropertieCard";
import NavBarMain from "@/components/NavBarMain";
import PropertieCard from "@/components/PropertieCard";
import Recommend from "@/components/recommend";
import SearchBar from "@/components/SearchBar";
import { HeartIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [data, setFilter] = usePropertyCreate({});
  console.log("Data fetched:", data);
  return (
    <>
      <NavBarMain />
      <div className="h-full flex justify-center items-center flex-wrap flex-col w-full">
        <SearchBar setFilter={setFilter} />

        <div className="flex justify-center items-center flex-wrap ">
          {data.length == 0 && (
            <Image
              src={"/empty.svg"}
              className="mt-[5%]"
              alt="Empty"
              height={800}
              width={800}
            />
          )}
          {data.map((e, i) => (
            <PropertieCard data={e} key={i}>
              <>
                <div className="px-5 pb-5 flex-wrap flex justify-around">
                  <DialogDemo name="View Details">
                    <FullPropertyCard property={e} />
                  </DialogDemo>
                  <div className="flex gap-7 justify-center items-center">
                    <Recommend property_id={e._id} />
                    <FavoriteSend id={e._id} favorite={e.favorite ?? false} />
                  </div>
                </div>
              </>
            </PropertieCard>
          ))}
        </div>
      </div>
    </>
  );
}
