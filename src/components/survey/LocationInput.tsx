import React, { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import type { SurveyData } from "../../pages/Survey"

interface LocationInputProps {
  surveyData: SurveyData
  setSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>
}

interface Suggestion {
  properties: {
    formatted: string
    lat: number
    lon: number
  }
}

const LocationInput: React.FC<LocationInputProps> = ({ surveyData, setSurveyData }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

useEffect(() => {
  if (!surveyData.location || surveyData.location.length < 2) {
    setSuggestions([]);
    return;
  }

const fetchData = async () => {
  try {
    const params = `/api/geoapify/autocomplete?text=${encodeURIComponent(surveyData.location)}`;
    const url = import.meta.env.VITE_BACKEND_URL + params;
    console.log("Frontend making request to:", url);
    console.log(import.meta.env.VITE_BACKEND_URL);
    
    const res = await fetch(url);
    
    console.log("Frontend response status:", res.status);
    console.log("Frontend response headers:", res.headers.get('content-type'));
    console.log("Frontend response URL:", res.url);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Frontend error response:", errorText);
      throw new Error(`Status ${res.status}: ${errorText}`);
    }

    // Check content type before parsing JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await res.text();
      console.error("Expected JSON but got:", contentType);
      console.error("Response body:", textResponse.substring(0, 500));
      throw new Error('Expected JSON response');
    }

    const data = await res.json();
    console.log("Frontend received data:", data);
    setSuggestions(data.features || []);
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    setSuggestions([]);
  }
};

  const timeout = setTimeout(fetchData, 300);
  return () => clearTimeout(timeout);
}, [surveyData.location]);

  const handleSelect = (s: Suggestion) => {
    setSurveyData((prev) => ({
      ...prev,
      location: s.properties.formatted,
      latitude: s.properties.lat,
      longitude: s.properties.lon,
    }))
    setSuggestions([])
  }

  return (
    <>
    {surveyData.considerWeather === 'yes' && (<div className="relative">
      <Label htmlFor="location" className="text-sm font-medium">
        Location
      </Label>
      <Input
        id="location"
        placeholder="Enter your city"
        value={surveyData.location}
        onChange={(e) =>
          setSurveyData((prev) => ({ ...prev, location: e.target.value }))
        }
        className="mt-2"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto z-10">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              {s.properties.formatted}
            </li>
          ))}
        </ul>
      )}
      </div>)}
    </>
  )
}

export default LocationInput
