"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { SearchFilter } from "./Filter/SearchFilter";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { FilterProperties } from "@/backend/types";
import { clear } from "console";

export default function SearchBar({
  setFilter,
}: {
  setFilter: Dispatch<SetStateAction<FilterProperties>>;
}) {
  let id: NodeJS.Timeout;
  const [search, setSearch] = React.useState("");
  useEffect(() => {
    clearTimeout(id);
    if (search.length > 0) {
      id = setTimeout(() => {
        if (setFilter) {
          setFilter({ title: search, page: 1 });
        }
      }, 500);
    } else {
      setFilter((e) => {
        delete e.title;
        return { ...e };
      });
    }
  }, [search]);

  function handleChange(filter: FilterProperties) {
    setFilter(filter);
  }
  return (
    <>
      <form className=" flex items-center  w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full ">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="{2}"
                d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
              />
            </svg>
          </div>
          <input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search branch name..."
          />
        </div>
        {/* <button
    type="submit"
    className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    <svg
    className="w-4 h-4"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    >
    <path
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
    />
    </svg>
    <span className="sr-only">Search</span>
    </button> */}
        <Button className="mx-2">
          <Search />
        </Button>
        <SearchFilter onFilterChange={handleChange} />
      </form>
    </>
  );
}
