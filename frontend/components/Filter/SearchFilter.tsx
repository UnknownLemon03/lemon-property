"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Filter,
  FilterX,
  Home,
  MapPin,
  Bed,
  Bath,
  Star,
  Calendar,
  User,
  Check,
  Heart,
  Building,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { getFiltersOptions } from "@/backend/backend";
import toast from "react-hot-toast";
import { FilterOptions } from "@/backend/types";

export interface FilterProperties {
  title?: string;
  typeProperty?: string; // villa, Studio, penthouse
  priceMin?: [number, number]; // 0
  state?: string; // delhi maharashtra
  city?: string; // thane
  areaSqFt?: [number, number]; // 2323
  bedrooms?: number; // 1, 2
  bathrooms?: number; // 1, 2
  furnished?: string;
  amenities?: string[];
  availableFrom?: string[];
  listedBy?: string;
  rating?: number; // 1,2,3,4,5
  type?: string; // buy | sell
  isVerified?: boolean;
  listingType?: string;
  userProperty?: boolean; // true if user property
  page?: number; // 1,
  recommendation?: boolean; // true if recommendation
  favorite?: boolean; // true if favorite
}

// Multi-Select Component for amenities and other multi-value fields

// function MultiSelect({
//   options,
//   value = [],
//   onChange,
//   placeholder,
// }: {
//   options: string[];
//   value: string[];
//   onChange: (value: string[]) => void;
//   placeholder: string;
// }) {
//   const handleToggle = (option: string) => {
//     if (value.includes(option)) {
//       onChange(value.filter((item) => item !== option));
//     } else {
//       onChange([...value, option]);
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <div className="flex flex-wrap gap-1 mb-2">
//         {value.map((item) => (
//           <Badge key={item} variant="secondary" className="text-xs">
//             {item}
//             <button
//               onClick={() => handleToggle(item)}
//               className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
//             >
//               ×
//             </button>
//           </Badge>
//         ))}
//       </div>
//       <div className="max-h-32 overflow-y-auto space-y-1">
//         {options.map((option) => (
//           <div key={option} className="flex items-center space-x-2">
//             <Checkbox
//               id={option}
//               checked={value.includes(option)}
//               onCheckedChange={() => handleToggle(option)}
//             />
//             <Label htmlFor={option} className="text-sm">
//               {option}
//             </Label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}) {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-2 max-w-[250px] w-full">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{placeholder}</SelectLabel>
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 px-2 py-1"
              >
                <Checkbox
                  id={option}
                  checked={value.includes(option)}
                  onCheckedChange={() => handleToggle(option)}
                />
                <Label htmlFor={option} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-1">
        {value.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="text-xs flex items-center gap-1"
          >
            {item}
            <button
              onClick={() => handleToggle(item)}
              className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
export function SearchFilter({
  onFilterChange,
}: {
  onFilterChange?: (filters: FilterProperties) => void;
}) {
  const [filters, setFilters] = useState<FilterProperties>({
    priceMin: [0, 10000000],
    areaSqFt: [0, 5000],
    amenities: [],
    availableFrom: [],
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    propertyTypes: [],
    states: [],
    cities: [],
    furnishingOptions: [],
    listedByOptions: [],
    listingTypes: [],
    amenitiesOptions: [],
  });

  const updateFilter = (key: keyof FilterProperties, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };
  useEffect(() => {
    const lastFetched = localStorage.getItem("filtersLastFetched");
    const now = Date.now();
    const TEN_MIN = 10 * 60 * 1000;

    if (!lastFetched || now - parseInt(lastFetched) > TEN_MIN) {
      getFiltersOptions().then((e) => {
        if (e.success) {
          setFilterOptions(e.data);
          localStorage.setItem("filtersLastFetched", now.toString());
        } else {
          toast.error("Error Fetching Filter options");
        }
      });
    } else {
      const cachedOptions = localStorage.getItem("filterOptions");
      if (cachedOptions) {
        setFilterOptions(JSON.parse(cachedOptions));
      } else {
        getFiltersOptions().then((e) => {
          if (e.success) {
            setFilterOptions(e.data);
            localStorage.setItem("filterOptions", JSON.stringify(e.data));
          } else {
            toast.error("Error Fetching Filter options");
          }
        });
      }
    }
  }, []);
  const applyFilters = () => {
    onFilterChange?.(filters);
    console.log("Filters applied:", filters);
  };
  useEffect(() => {}, [filters]);
  const clearFilters = () => {
    const clearedFilters: FilterProperties = {
      priceMin: [0, 10000000],
      areaSqFt: [0, 5000],
      amenities: [],
      availableFrom: [],
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-80 py-1 px-2 scrollbar-hide w-fit max-h-96 overflow-y-auto">
        <DropdownMenuLabel>Property Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Search by Title */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Home className="w-4 h-4" />
              <span>Property Type</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2">
                <Select
                  value={filters.typeProperty || ""}
                  onValueChange={(value) => updateFilter("typeProperty", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Location Filters */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2 space-y-3">
                <div>
                  <Label className="text-sm">State</Label>
                  <Select
                    value={filters.state || ""}
                    onValueChange={(value) => updateFilter("state", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">City</Label>
                  <Select
                    value={filters.city || ""}
                    onValueChange={(value) => updateFilter("city", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Price Range */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>₹</span>
              <span>Price Range</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-3 space-y-3">
                <Label className="text-sm font-medium">
                  Price: ₹ {filters.priceMin?.[0].toLocaleString()} - ₹
                  {filters.priceMin?.[1].toLocaleString()}
                </Label>
                <Slider
                  value={filters.priceMin || [0, 10000000]}
                  onValueChange={(value) =>
                    updateFilter("priceMin", value as [number, number])
                  }
                  max={10000000}
                  step={100000}
                  className="w-48"
                />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Area Range */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Building className="w-4 h-4" />
              <span>Area (Sq Ft)</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-3 space-y-3">
                <Label className="text-sm font-medium">
                  Area: {filters.areaSqFt?.[0]} - {filters.areaSqFt?.[1]} sq ft
                </Label>
                <Slider
                  value={filters.areaSqFt || [0, 5000]}
                  onValueChange={(value) =>
                    updateFilter("areaSqFt", value as [number, number])
                  }
                  max={5000}
                  step={100}
                  className="w-48"
                />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Bedrooms & Bathrooms */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Bed className="w-4 h-4" />
              <span>Rooms</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2 space-y-3">
                <div>
                  <Label className="text-sm">Bedrooms</Label>
                  <Select
                    value={filters.bedrooms?.toString() || ""}
                    onValueChange={(value) =>
                      updateFilter("bedrooms", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Bathrooms</Label>
                  <Select
                    value={filters.bathrooms?.toString() || ""}
                    onValueChange={(value) =>
                      updateFilter("bathrooms", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Furnishing */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>🛋️</span>
              <span>Furnishing</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2">
                <Select
                  value={filters.furnished || ""}
                  onValueChange={(value) => updateFilter("furnished", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.furnishingOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Amenities */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>🏊</span>
              <span>Amenities</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2 w-fit ">
                <MultiSelect
                  options={filterOptions.amenitiesOptions}
                  value={filters.amenities || []}
                  onChange={(value) => updateFilter("amenities", value)}
                  placeholder="Select amenities"
                />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Listed By */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <User className="w-4 h-4" />
              <span>Listed By</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2">
                <Select
                  value={filters.listedBy || ""}
                  onValueChange={(value) => updateFilter("listedBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.listedByOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Rating */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Star className="w-4 h-4" />
              <span>Rating</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2">
                <Select
                  value={filters.rating?.toString() || ""}
                  onValueChange={(value) =>
                    updateFilter("rating", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating}+ Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Type (Buy/Sell) */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>🏷️</span>
              <span>Transaction Type</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2">
                <Select
                  value={filters.type || ""}
                  onValueChange={(value) => updateFilter("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Boolean Filters */}
          <div className="p-2 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Verified Only</Label>
              <Switch
                checked={filters.isVerified || false}
                onCheckedChange={(checked) =>
                  updateFilter("isVerified", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">User Properties</Label>
              <Switch
                checked={filters.userProperty || false}
                onCheckedChange={(checked) =>
                  updateFilter("userProperty", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Recommendations</Label>
              <Switch
                checked={filters.recommendation || false}
                className="mx-l"
                onCheckedChange={(checked) =>
                  updateFilter("recommendation", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Favorites Only</Label>
              <Switch
                checked={filters.favorite || false}
                onCheckedChange={(checked) => updateFilter("favorite", checked)}
              />
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Action Buttons */}
        <DropdownMenuItem onClick={applyFilters}>
          <Filter className="w-4 h-4" />
          <span>Apply Filters</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={clearFilters}>
          <FilterX className="w-4 h-4" />
          <span>Clear All Filters</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
