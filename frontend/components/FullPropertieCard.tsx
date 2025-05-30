"use client";
import { IProperty } from "@/backend/types";
import React from "react";

export default function FullPropertyCard({
  property,
}: {
  property: IProperty;
}) {
  // Format price with commas and INR symbol

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date to readable string
  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  console.log(property);

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-96 flex flex-col overflow-hidden border-t-8 border-blue-400 max-h-screen overflow-y-auto">
      <div className="bg-gray-50 border-b border-gray-300 px-4 sm:px-5 py-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-1">
          {property.title}
        </h2>
        <div className="text-xs sm:text-sm text-gray-500">
          {property.type} - ID: {property._id}
        </div>
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
          {formatPrice(property.price)}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 capitalize">
          {property.listingType} Listing
        </div>
      </div>
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="mb-3 sm:mb-0">
            <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
              Location
            </div>
            <div className="text-gray-700 text-xs sm:text-sm">
              {property.city}, {property.state}
            </div>
          </div>
          <div className="mb-3 sm:mb-0">
            <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
              Area
            </div>
            <div className="text-gray-700 text-xs sm:text-sm">
              {property.areaSqFt} sq ft
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="mb-3 sm:mb-0">
            <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
              Bedrooms
            </div>
            <div className="text-gray-700 text-xs sm:text-sm">
              {property.bedrooms}
            </div>
          </div>
          <div className="mb-3 sm:mb-0">
            <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
              Bathrooms
            </div>
            <div className="text-gray-700 text-xs sm:text-sm">
              {property.bathrooms}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
            Furnishing
          </div>
          <div className="text-gray-700 text-xs sm:text-sm">
            {property.furnished}
          </div>
        </div>
        <div className="mb-3">
          <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
            Available From
          </div>
          <div className="text-gray-700 text-xs sm:text-sm">
            {formattedDate(property.availableFrom)}
          </div>
        </div>
        <div className="mb-3">
          <div className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
            Listed By
          </div>
          <div className="text-gray-700 text-xs sm:text-sm">
            {property.listedBy}
          </div>
        </div>

        <div>
          <div className="font-bold text-gray-600 mb-2 border-b border-gray-300 pb-1 text-sm sm:text-base">
            Amenities
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {property.amenities &&
              property.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 sm:px-3 py-1 select-none"
                >
                  {amenity}
                </span>
              ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="font-bold text-gray-600 mb-2 border-b border-gray-300 pb-1 text-sm sm:text-base">
            Tags
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {property.tags &&
              property.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 sm:px-3 py-1 select-none"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-300 px-4 sm:px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-gray-600 text-xs sm:text-sm font-semibold">
        <div
          className="flex items-center space-x-1"
          title={`Rating: ${property.rating}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.165L12 18.897l-7.334 3.86 1.4-8.165L.132 9.21l8.2-1.192z" />
          </svg>
          <span>{property.rating}</span>
        </div>
        {property.isVerified && (
          <div className="text-green-700 font-bold" title="Verified Property">
            ✔ Verified
          </div>
        )}
        {!property.isVerified && (
          <div className="text-red-700 font-bold" title="Not Verified Property">
            ✘ Not Verified
          </div>
        )}
      </div>
    </div>
  );
}
