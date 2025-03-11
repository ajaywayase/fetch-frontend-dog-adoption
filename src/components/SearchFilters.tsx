import { useEffect, useState, useRef } from "react";
import { Filter, SortAsc, SortDesc, MapPin } from "lucide-react";
import { getBreeds, searchLocations } from "../lib/api";
import { cn } from "../lib/utils";
import type { Location } from "../types";

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    breeds: string[];
    ageMin?: number;
    ageMax?: number;
    sort: string;
    zipCodes?: string[];
  }) => void;
}

interface CityLocation {
  city: string;
  state: string;
  zipCodes: Location[];
}

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [locations, setLocations] = useState<CityLocation[]>([]);
  const [selectedCities, setSelectedCities] = useState<CityLocation[]>([]);

  const filtersRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Fetch breeds on first render
  useEffect(() => {
    getBreeds().then(setBreeds);
  }, []);
  
  // Debounced location search based on city and selected states
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (citySearch || selectedStates.length > 0) {
        try {
          const response = await searchLocations({
            city: citySearch,
            states: selectedStates.length > 0 ? selectedStates : undefined,
            size: 100,
          });

          const cityMap = new Map<string, CityLocation>();
          response.results.forEach((location) => {
            const key = `${location.city}-${location.state}`;
            if (!cityMap.has(key)) {
              cityMap.set(key, {
                city: location.city,
                state: location.state,
                zipCodes: [],
              });
            }
            cityMap.get(key)!.zipCodes.push(location);
          });

          setLocations(Array.from(cityMap.values()));
        } catch (error) {
          console.error("Failed to fetch locations:", error);
        }
      } else {
        setLocations([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [citySearch, selectedStates]);
  
  
  // Trigger filter change on every relevant state change
  useEffect(() => {
    const allZipCodes = selectedCities.flatMap((city) =>
      city.zipCodes.map((loc) => loc.zip_code)
    );
    onFiltersChange({
      breeds: selectedBreeds,
      ageMin: ageRange.min ? parseInt(ageRange.min) : undefined,
      ageMax: ageRange.max ? parseInt(ageRange.max) : undefined,
      sort: `breed:${sortOrder}`,
      zipCodes: allZipCodes,
    });
  }, [selectedBreeds, ageRange, sortOrder, selectedCities, onFiltersChange]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <div ref={filtersRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 z-10 w-80 mt-2 p-4 bg-white rounded-xl shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={ageRange.min}
                    onChange={(e) =>
                      setAgeRange((prev) => ({ ...prev, min: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={ageRange.max}
                    onChange={(e) =>
                      setAgeRange((prev) => ({ ...prev, max: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breeds
                </label>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {breeds.map((breed) => (
                    <label key={breed} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBreeds.includes(breed)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBreeds([...selectedBreeds, breed]);
                          } else {
                            setSelectedBreeds(
                              selectedBreeds.filter((b) => b !== breed)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {breed}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
        >
          {sortOrder === "asc" ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
          {sortOrder === "asc" ? "A to Z" : "Z to A"}
        </button>

        <div ref={locationRef}>
          <button
            onClick={() => setShowLocationSearch(!showLocationSearch)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50",
              showLocationSearch ? "bg-purple-100" : "bg-white"
            )}
          >
            <MapPin className="w-4 h-4" />
            Location
          </button>

          {showLocationSearch && (
            <div className="absolute top-full left-0 z-10 w-96 mt-2 p-4 bg-white rounded-xl shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by City
                </label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select States
                </label>
                <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
                  {US_STATES.map((state) => (
                    <button
                      key={state}
                      onClick={() => {
                        setSelectedStates((prev) =>
                          prev.includes(state)
                            ? prev.filter((s) => s !== state)
                            : [...prev, state]
                        );
                      }}
                      className={cn(
                        "px-2 py-1 text-xs rounded",
                        selectedStates.includes(state)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              {locations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cities
                  </label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {locations.map((cityLocation) => (
                      <button
                        key={`${cityLocation.city}-${cityLocation.state}`}
                        onClick={() => {
                          const cityKey = `${cityLocation.city}-${cityLocation.state}`;
                          if (
                            !selectedCities.some(
                              (c) => `${c.city}-${c.state}` === cityKey
                            )
                          ) {
                            setSelectedCities([
                              ...selectedCities,
                              cityLocation,
                            ]);
                          }
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="text-sm font-medium">
                          {cityLocation.city}, {cityLocation.state}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cityLocation.zipCodes.length} ZIP code
                          {cityLocation.zipCodes.length > 1 ? "s" : ""}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedCities.length > 0 && (
          <div className="flex gap-2">
            {selectedCities.map((cityLocation) => (
              <span
                key={`${cityLocation.city}-${cityLocation.state}`}
                className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-lg text-sm"
              >
                {cityLocation.city}, {cityLocation.state}
                <span className="text-xs text-gray-500">
                  ({cityLocation.zipCodes.length} ZIP
                  {cityLocation.zipCodes.length > 1 ? "s" : ""})
                </span>
                <button
                  onClick={() =>
                    setSelectedCities(
                      selectedCities.filter(
                        (c) =>
                          c.city !== cityLocation.city ||
                          c.state !== cityLocation.state
                      )
                    )
                  }
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
