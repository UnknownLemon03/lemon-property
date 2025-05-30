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
import { Button } from "@/components/ui/button";
import { HeartIcon, PlusCircle, Share2Icon } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Home() {
  const [data, setFilter, filter] = usePropertyCreate({});
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
      <div className="flex mb-5 justify-center items-center flex-col w-full">
        {/* <Button
          className="cursor-pointer"
          onClick={() =>
            setFilter((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
          }
        >
          Load More
          <PlusCircle />
        </Button> */}
        <Pagination>
          <PaginationContent>
            {filter.page != 1 && (
              <PaginationItem
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    page: prev.page && prev.page > 1 ? prev.page - 1 : 0,
                  }))
                }
              >
                <PaginationPrevious href="#" />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#">{filter.page ?? 1}</PaginationLink>
            </PaginationItem>
            {data.length != 0 && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      page: prev.page && data.length != 0 ? prev.page + 1 : 0,
                    }))
                  }
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
