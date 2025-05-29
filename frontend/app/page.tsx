"use client";
import { PropertyFetch, usePropertyCreate } from "@/backend/backend";
import { IProperty } from "@/backend/types";
import NavBarMain from "@/components/NavBarMain";
import PropertieCard from "@/components/PropertieCard";
import SearchBar from "@/components/SearchBar";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [data, setFilter] = usePropertyCreate();
  return (
    <>
      <NavBarMain />
      <div className="h-full flex justify-center items-center flex-col w-full">
        <SearchBar setFilter={setFilter} />

        <div className="flex justify-center items-center flex-wrap lg:mx-30 md:mx-2 ">
          {data.map((e, i) => (
            <PropertieCard data={e} key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
