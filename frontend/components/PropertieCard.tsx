"use client";

import React from "react";
import {
  MapPin,
  Home,
  Bath,
  Bed,
  Calendar,
  Star,
  Shield,
  User,
} from "lucide-react";
import { IProperty } from "@/backend/types";
import { DialogDemo } from "./Dialog";
import FullPropertyCard from "./FullPropertieCard";
import PropertyForm from "./NewPropertie";
import { Button } from "./ui/button";

export default function PropertyCard({
  data,
  edit = false,
  handleDelete,
  doFilterRefresh,
}: {
  edit?: boolean;
  data: IProperty;
  handleDelete?: () => Promise<void>;
  doFilterRefresh?: () => void;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  async function handleDeleteEvent(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (handleDelete) handleDelete();
  }

  return (
    <div className="relative flex flex-col my-6 mx-2 bg-white shadow-lg border border-slate-200 rounded-xl w-96 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="relative p-5 bg-gradient-to-r from-gray-50 to-slate-100 border-b border-gray-200">
        {/* Badges */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            <span className="bg-white text-slate-800 px-2 py-1 rounded-full text-xs font-medium border">
              {data.type}
            </span>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              For {data.listingType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {data.isVerified && (
              <div className="bg-green-500 p-1 rounded-full">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="bg-white px-2 py-1 rounded-full flex items-center gap-1 border">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-slate-800">
                {data.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Property ID */}
        {/* <div className="text-right">
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-mono">
            {data._id}
          </span>
        </div> */}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1">
            {data.title}
          </h3>
          <div className="flex items-center text-slate-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {data.city}, {data.state}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div
            className="text-2xl font-bold"
            style={{ color: data.colorTheme }}
          >
            {formatPrice(data.price)}
            <span className="text-sm font-normal text-slate-600 ml-1">
              /month
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div className="flex flex-col items-center">
            <Home className="w-5 h-5 text-slate-500 mb-1" />
            <span className="text-xs text-slate-600">Area</span>
            <span className="text-sm font-semibold text-slate-800">
              {data.areaSqFt} sqft
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Bed className="w-5 h-5 text-slate-500 mb-1" />
            <span className="text-xs text-slate-600">Bedrooms</span>
            <span className="text-sm font-semibold text-slate-800">
              {data.bedrooms}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Bath className="w-5 h-5 text-slate-500 mb-1" />
            <span className="text-xs text-slate-600">Bathrooms</span>
            <span className="text-sm font-semibold text-slate-800">
              {data.bathrooms}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs capitalize"
              >
                {tag.replace("-", " ")}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Available: {formatDate(data.availableFrom)}</span>
          </div>
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            <span>By {data.listedBy}</span>
          </div>
          <div className="col-span-2">
            <span className="font-medium">Furnished: </span>
            <span>{data.furnished}</span>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-1">Key Amenities:</p>
          <p className="text-sm text-slate-700">
            {data.amenities
              .slice(0, 3)
              .map((amenity) => amenity.replace("-", " "))
              .join(", ")}
            {data.amenities.length > 3 && ` +${data.amenities.length - 3} more`}
          </p>
        </div>
      </div>

      {/* Action Button */}
      {!edit && (
        <div className="px-5 pb-5 flex justify-around">
          {/* <button
            className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            style={{
              backgroundColor: data.colorTheme,
              boxShadow: `0 4px 14px 0 ${data.colorTheme}40`,
            }}
          >
            View Details
          </button> */}
          <DialogDemo name="View Details">
            <FullPropertyCard property={data} />
          </DialogDemo>
        </div>
      )}
      {edit && (
        <div className="px-5 pb-5 flex justify-around">
          <DialogDemo
            variant={"secondary"}
            className="cursor-pointer"
            name="Edit Property"
          >
            <PropertyForm
              doFilterRefresh={doFilterRefresh}
              existingData={data}
            />
          </DialogDemo>

          <Button variant={"destructive"} className="cursor-pointer">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
