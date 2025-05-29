import { AddProperty, UpdateProperty } from "@/backend/backend";
import { IProperty } from "@/backend/types";
import { DialogClose } from "@radix-ui/react-dialog";
import React, { use, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const furnishedOptions = [
  "Furnished",
  "Unfurnished",
  "Semi-Furnished",
] as const;
const listingTypes = ["rent", "sale"] as const;

export default function PropertyForm({
  existingData,
  doFilterRefresh = () => {},
}: {
  existingData?: IProperty;
  doFilterRefresh?: () => void;
}) {
  const router = useRouter();
  const [amenities, setAmenities] = useState<string[]>(
    existingData ? existingData.amenities || [] : []
  );
  const [tags, setTags] = useState<string[]>(
    existingData ? existingData.tags || [] : []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(
    new Set(existingData ? existingData.amenities || [] : [])
  );
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(existingData ? existingData.tags || [] : [])
  );
  const [newAmenity, setNewAmenity] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(amenity)) {
        newSet.delete(amenity);
      } else {
        newSet.add(amenity);
      }
      return newSet;
    });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const addAmenity = () => {
    const trimmed = newAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
      setSelectedAmenities((prev) => new Set(prev).add(trimmed));
      setNewAmenity("");
    }
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setSelectedTags((prev) => new Set(prev).add(trimmed));
      setNewTag("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    data["amenities"] = Array.from(selectedAmenities);
    data["tags"] = Array.from(selectedTags);
    if (existingData) {
      UpdateProperty(data as IProperty).then((response) => {
        if (response.success) {
          toast.success("Property added successfully!");
          setAmenities([]);
          setTags([]);
          setSelectedAmenities(new Set());
          setSelectedTags(new Set());
          doFilterRefresh();
          closeBtnRef.current?.click();
        } else {
          toast.error("Failed to add property. Please try again.");
        }
      });
    } else {
      AddProperty(data as IProperty).then((response) => {
        if (response.success) {
          toast.success("Property added successfully!");
          closeBtnRef.current?.click();
          setAmenities([]);
          setTags([]);
          setSelectedAmenities(new Set());
          setSelectedTags(new Set());
          doFilterRefresh();
        } else {
          toast.error("Failed to add property. Please try again.");
        }
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Property Details Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        {existingData && (
          <input name="_id" hidden defaultValue={existingData._id} />
        )}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-900"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={existingData ? existingData.title : ""}
            placeholder="Enter property title"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-900"
          >
            Type
          </label>
          <input
            type="text"
            name="type"
            id="type"
            required
            defaultValue={existingData ? existingData.type : ""}
            placeholder="e.g., Apartment, House, Villa"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-900"
          >
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            min={0}
            defaultValue={existingData ? existingData.price : ""}
            placeholder="Enter property price"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-900"
          >
            State
          </label>
          <input
            type="text"
            name="state"
            id="state"
            defaultValue={existingData ? existingData.state : ""}
            placeholder="Enter state or region"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-900"
          >
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            defaultValue={existingData ? existingData.city : ""}
            placeholder="Enter city or locality"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* AreaSqFt */}
        <div>
          <label
            htmlFor="areaSqFt"
            className="block text-sm font-medium text-gray-900"
          >
            Area (Sq Ft)
          </label>
          <input
            type="number"
            name="areaSqFt"
            id="areaSqFt"
            min={0}
            defaultValue={existingData ? existingData.areaSqFt : ""}
            placeholder="Enter area in square feet"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label
            htmlFor="bedrooms"
            className="block text-sm font-medium text-gray-900"
          >
            Bedrooms
          </label>
          <input
            type="number"
            name="bedrooms"
            id="bedrooms"
            min={0}
            defaultValue={existingData ? existingData.bedrooms : ""}
            placeholder="Enter number of bedrooms"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label
            htmlFor="bathrooms"
            className="block text-sm font-medium text-gray-900"
          >
            Bathrooms
          </label>
          <input
            type="number"
            name="bathrooms"
            id="bathrooms"
            defaultValue={existingData ? existingData.bathrooms : ""}
            placeholder="Enter number of bathrooms"
            required
            min={0}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* Amenities */}
        <fieldset>
          <legend className="block text-sm font-medium text-gray-900 mb-1">
            Amenities
          </legend>

          <div className="flex flex-wrap gap-3 mb-2 max-w-sm">
            {amenities.length > 0 ? (
              amenities.map((amenity) => (
                <label
                  key={amenity}
                  htmlFor={`amenity-${amenity}`}
                  className="flex items-center space-x-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    name="amenities"
                    value={amenity}
                    checked={selectedAmenities.has(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="h-4 w-4 text-gray-700 border-gray-400 rounded"
                  />
                  <span className="capitalize text-gray-800">
                    {amenity.replace(/-/g, " ")}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 italic">No amenities added yet</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Add new amenity"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              className="flex-grow rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            />
            <button
              type="button"
              onClick={addAmenity}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:ring-gray-500 focus:ring-offset-2 focus:ring-2"
            >
              Add
            </button>
          </div>
        </fieldset>

        {/* Furnished */}
        <div>
          <label
            htmlFor="furnished"
            className="block text-sm font-medium text-gray-900"
          >
            Furnished
          </label>
          <select
            name="furnished"
            id="furnished"
            defaultValue={existingData ? existingData.furnished : "Furnished"}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          >
            {furnishedOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Available From */}
        <div>
          <label
            htmlFor="availableFrom"
            className="block text-sm font-medium text-gray-900"
          >
            Available From
          </label>
          <input
            type="date"
            name="availableFrom"
            id="availableFrom"
            defaultValue={
              existingData
                ? new Date(existingData.availableFrom)
                    .toISOString()
                    .split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* Listed By */}
        <div>
          <label
            htmlFor="listedBy"
            className="block text-sm font-medium text-gray-900"
          >
            Listed By
          </label>
          <input
            type="text"
            name="listedBy"
            id="listedBy"
            defaultValue={existingData ? existingData.listedBy : ""}
            placeholder="Enter name of the person or agency"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          />
        </div>

        {/* Tags */}
        <fieldset>
          <legend className="block text-sm font-medium text-gray-900 mb-1">
            Tags
          </legend>

          <div className="flex flex-wrap max-w-sm gap-3 mb-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <label
                  key={tag}
                  htmlFor={`tag-${tag}`}
                  className="flex flex-col items-center flex-wrap max-w-sm space-x-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id={`tag-${tag}`}
                    name="tags"
                    value={tag}
                    checked={selectedTags.has(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="h-4 w-4 text-gray-700 border-gray-400 rounded"
                  />
                  <span className="capitalize text-gray-800">
                    {tag.replace(/-/g, " ")}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 italic">No tags added yet</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Add new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-grow rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:ring-gray-500 focus:ring-offset-2 focus:ring-2"
            >
              Add
            </button>
          </div>
        </fieldset>

        {/* Color Theme */}
        <div>
          <label
            htmlFor="colorTheme"
            className="block text-sm font-medium text-gray-900"
          >
            Color Theme
          </label>
          <input
            type="color"
            name="colorTheme"
            id="colorTheme"
            defaultValue={existingData ? existingData.colorTheme : ""}
            required
            className="mt-1 h-10 w-20 rounded-md border border-gray-300 bg-white px-1 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600"
          />
        </div>

        {/* Is Verified */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isVerified"
            id="isVerified"
            defaultChecked={existingData ? existingData.isVerified : false}
            className="h-4 w-4 text-gray-700 border-gray-400 rounded"
            value="true"
          />
          <label
            htmlFor="isVerified"
            className="ml-2 block text-sm font-medium text-gray-900"
          >
            Verified Listing
          </label>
        </div>

        {/* Listing Type */}
        <div>
          <label
            htmlFor="listingType"
            className="block text-sm font-medium text-gray-900"
          >
            Listing Type
          </label>
          <select
            name="listingType"
            id="listingType"
            defaultValue={existingData ? existingData.listingType : "rent"}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-600 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          >
            {listingTypes.map((option) => (
              <option value={option} key={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-800 focus:ring-gray-500 focus:ring-offset-2 text-white rounded-md shadow-md transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
      <DialogClose ref={closeBtnRef} asChild className="hidden">
        <Button type="button" variant="secondary">
          Close
        </Button>
      </DialogClose>
    </div>
  );
}
