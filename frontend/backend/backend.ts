"use client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { error } from "console";
import { json } from "stream/consumers";
import { FilterProperties, IProperty } from "./types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";
export interface userDetails {
  email: string;
  password: string;
}
export interface ApiResponse<T> {
  data: T;
  error: string;
  toast?: string;
  success: boolean;
}

export async function Auth(
  data: userDetails,
  login: boolean
): Promise<ApiResponse<null>> {
  const req = await axios.post<ApiResponse<null>>(
    login ? "/auth/login" : "/auth/signup",
    data
  );
  return req.data;
}

export async function PropertyFetch(
  FilterProperties: FilterProperties
): Promise<ApiResponse<IProperty[]>> {
  const req = await axios.post<ApiResponse<IProperty[]>>(
    "/property/filter",
    FilterProperties
  );
  return req.data;
}

let id_timeout_filter: NodeJS.Timeout;
export function usePropertyCreate(
  createdByUser: boolean = false
): [IProperty[], Dispatch<SetStateAction<FilterProperties>>] {
  const [data, setData] = useState<IProperty[]>([]);
  const [filter, setFilter] = useState<FilterProperties>({ page: 1 });
  useEffect(() => {
    clearTimeout(id_timeout_filter);
    id_timeout_filter = setTimeout(() => {
      PropertyFetch({ ...filter, userProperty: createdByUser })
        .then((res) => {
          if (res.error) {
            console.error("Error fetching properties:", res.error);
            toast.error(res.error);
          } else {
            setData(res.data);
            console.log("Properties fetched successfully:", res.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching properties:", err);
          toast.error("Failed to fetch properties");
        });
    }, 800);
    // }, [JSON.stringify(filter)]);
  }, [filter]);

  return [data, setFilter];
}

export async function DeleteProperty(id: string): Promise<ApiResponse<null>> {
  const req = await axios.delete<ApiResponse<null>>("/property/", {
    data: { id },
  });
  return req.data;
}
export async function AddProperty(data: IProperty): Promise<ApiResponse<null>> {
  const req = await axios.post<ApiResponse<null>>("/property/", data);
  return req.data;
}
export async function UpdateProperty(
  data: IProperty
): Promise<ApiResponse<null>> {
  const req = await axios.put<ApiResponse<null>>("/property/", data);
  return req.data;
}
