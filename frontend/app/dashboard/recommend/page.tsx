"use client";
import { usePropertyCreate } from "@/backend/backend";
import { DialogDemo } from "@/components/Dialog";
import PropertyForm from "@/components/NewPropertie";
import SearchBar from "@/components/SearchBar";
import React, { use } from "react";
import PropertieCard from "@/components/PropertieCard";
import { Button } from "@/components/ui/button";
import FullPropertyCard from "@/components/FullPropertieCard";
import Recommend from "@/components/recommend";
import FavoriteSend from "@/components/FavoriteSend";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
export default function page() {
  const [data, setFilter, filter] = usePropertyCreate({ recommendation: true });
  return (
    <>
      <h3 className="text-2xl ml-[1%] md:ml-[2%] lg:ml-[5%] mb-3 font-semibold text-gray-600">
        Recommended Propertyies
      </h3>
      <div className="h-full w-full  mb-5 flex justify-start items-center flex-col ">
        {data.length == 0 && (
          <Image
            src={"/empty.svg"}
            className="mt-[10%]"
            alt="Empty"
            height={800}
            width={800}
          />
        )}
        {data.length > 0 && <SearchBar setFilter={setFilter} />}
        <div className="flex justify-center items-center flex-wrap lg:mx-30 md:mx-2 ">
          {data.map((e, i) => (
            <PropertieCard data={e} key={i}>
              <>
                <div className="px-5 pb-5 flex justify-around">
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
      </div>
    </>
  );
}
