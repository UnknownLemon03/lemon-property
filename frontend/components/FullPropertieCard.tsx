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
    <div className=" bg-white rounded-xl shadow-lg w-96 flex flex-col overflow-hidden border-t-8 border- -400">
      <div className="bg-gray-50 border-b border-gray-300 px-5 py-4">
        <h2 className="text-xl font-semibold text-gray-600 mb-1">
          {property.title}
        </h2>
        <div className="text-sm text-gray-500">
          {property.type} - ID: {property._id}
        </div>
        <div className="text-2xl font-bold text-gray-900 mt-2">
          {formatPrice(property.price)}
        </div>
        <div className="text-sm text-gray-500 capitalize">
          {property.listingType} Listing
        </div>
      </div>
      <div className="p-5 flex-1">
        <div className="flex justify-between flex-wrap mb-3">
          <div className="mb-3 w-1/2">
            <div className="font-semibold text-gray-600 mb-1">Location</div>
            <div className="text-gray-700 text-sm">
              {property.city}, {property.state}
            </div>
          </div>
          <div className="mb-3 w-1/2">
            <div className="font-semibold text-gray-600 mb-1">Area</div>
            <div className="text-gray-700 text-sm">
              {property.areaSqFt} sq ft
            </div>
          </div>
        </div>
        <div className="flex justify-between flex-wrap mb-3">
          <div className="mb-3 w-1/2">
            <div className="font-semibold text-gray-600 mb-1">Bedrooms</div>
            <div className="text-gray-700 text-sm">{property.bedrooms}</div>
          </div>
          <div className="mb-3 w-1/2">
            <div className="font-semibold text-gray-600 mb-1">Bathrooms</div>
            <div className="text-gray-700 text-sm">{property.bathrooms}</div>
          </div>
        </div>
        <div className="mb-3">
          <div className="font-semibold text-gray-600 mb-1">Furnishing</div>
          <div className="text-gray-700 text-sm">{property.furnished}</div>
        </div>
        <div className="mb-3">
          <div className="font-semibold text-gray-600 mb-1">Available From</div>
          <div className="text-gray-700 text-sm">
            {formattedDate(property.availableFrom)}
          </div>
        </div>
        <div className="mb-3">
          <div className="font-semibold text-gray-600 mb-1">Listed By</div>
          <div className="text-gray-700 text-sm">{property.listedBy}</div>
        </div>

        <div>
          <div className="font-bold text-gray-600 mb-2 border-b border-gray-300 pb-1">
            Amenities
          </div>
          <div className="flex flex-wrap gap-2">
            {property.amenities &&
              property.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1 select-none"
                >
                  {amenity}
                </span>
              ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="font-bold text-gray-600 mb-2 border-b border-gray-300 pb-1">
            Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {property.tags &&
              property.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1 select-none"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-300 px-5 py-3 flex justify-between items-center text-gray-600 text-sm font-semibold">
        <div
          className="flex items-center space-x-1"
          title={`Rating: ${property.rating}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-400"
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
