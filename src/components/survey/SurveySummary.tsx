import type { SurveyData } from '../../pages/Survey'
import { useState, useEffect } from "react"
import { getResponseFromLLM } from '../survey/llmEndpoint';

interface SurveySummaryProps {
  surveyData: SurveyData
}

interface PromptData {
  fitnessLevel: string; // e.g., "(occasional outdoor activity or workout)"
  currentFitness: number[]; // e.g., [8]
  biologicalSex?: string; // e.g., "female"
  height?: string; // e.g., "5'2\""
  weight?: string; // e.g., "158 lbs"
  activities: string[]; // e.g., ["Running", "Walking", ...]
  goals: string[]; // e.g., ["Build muscle", "Boost energy levels", ...]
  planPreference: string; // e.g., "variety-enjoyment"
  varietyImportance: number[]; // e.g., [81]
  interestedActivities: string[]; // e.g., ["Weight Lifting", "Swimming", ...]
  avoidActivities: string[]; // e.g., ["Yoga", "Barre", ...]
  workoutFrequency: number[]; // e.g., [4]
  workoutDays: string[]; // e.g., ["Tuesday", "Wednesday", ...]
  workoutDuration: string; // e.g., "30-60 minutes"
  considerWeather: string; // e.g., "yes"
  weather?: Weather[]; // e.g., { monday: "" }
  workoutPartner: string; // e.g., "With a partner"
  workoutTime: string; // e.g., "Early morning (4-7 AM)"
  additionalConsiderations?: string; // e.g., ""
}

interface Exercise {
    name: string;
    duration: number; // in minutes
    break: number; // in seconds
    intensity: string; // e.g., "low", "medium", "high"
    description: string;
    muscleGroups: string[]; // e.g., ["chest", "triceps"]
    equipment: string[]; // e.g., ["dumbbells", "bench"]
}
interface Activity {
    name: string;
    duration: number; // in minutes
    equipment: string[]; // e.g., ["yoga mat"]
}

interface Weather {
    type: string; // e.g., "sunny", "rainy"
    temperature: {
        min: number; // in Celsius
        max: number; // in Celsius
    };
    humidity: number; // in percentage
}

interface Workout {
    name: string;
    time: number; // in minutes
    weather?: Weather | null;
    activities: Exercise[];
}

interface WeeklyPlan {
    monday: (Workout | Activity);
    tuesday: (Workout | Activity);
    wednesday: (Workout | Activity);
    thursday: (Workout | Activity);
    friday: (Workout | Activity);
    saturday: (Workout | Activity);
    sunday: (Workout | Activity);
}

export default function SurveySummary({ surveyData }: SurveySummaryProps) {
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [response, setResponse] = useState<string>('');
  
    const prepareSurveyData = async (data: SurveyData): Promise<PromptData> => {
    // Make a shallow copy so we don't mutate original surveyData
    const temp: any = { ...data };

    // Remove hasExistingPlan and trainingForSpecific if answer is "no"
    if (temp.hasExistingPlan === "no") delete temp.hasExistingPlan;
    if (temp.trainingForSpecific === "no") delete temp.trainingForSpecific;

    // Remove selectedActivitiesEquipment if it contains "none"
    if (
      temp.selectedActivitiesEquipment &&
      Object.values(temp.selectedActivitiesEquipment).includes("none")
    ) {
      delete temp.selectedActivitiesEquipment;
    }

    // Initialize weather array
    const weatherArray: Weather[] = [];

    // Fetch weather and store in temp.weather
      if (temp.considerWeather === "yes" && temp.latitude && temp.longitude && temp.workoutDays?.length) {
      // console.log("Fetching weather data...");
      try {
        // 1. Find the date of the next Monday
        const today = new Date();
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));

        // 2. Request daily forecasts from Open-Meteo starting at next Monday
        const startDate = nextMonday.toISOString().split("T")[0]; // format: YYYY-MM-DD
        const endDate = new Date(nextMonday);
        endDate.setDate(nextMonday.getDate() + 6); // one week window
        const endDateStr = endDate.toISOString().split("T")[0];

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${temp.latitude}&longitude=${temp.longitude}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,weathercode&timezone=auto&temperature_unit=fahrenheit&start_date=${startDate}&end_date=${endDateStr}`;
        // console.log(url);

        const res = await fetch(url);
        const forecastData = await res.json();

        // 3. Map Open-Meteo codes to readable weather types
        const weatherCodeMap: Record<number, string> = {
          0: "Clear",
          1: "Mainly Clear",
          2: "Partly Cloudy",
          3: "Overcast",
          45: "Fog",
          48: "Rime Fog",
          51: "Light Drizzle",
          53: "Moderate Drizzle",
          55: "Dense Drizzle",
          61: "Light Rain",
          63: "Moderate Rain",
          65: "Heavy Rain",
          71: "Light Snow",
          73: "Moderate Snow",
          75: "Heavy Snow",
          95: "Thunderstorm",
        };

        // 4. Initialize weather object for promptData
        temp.weather = {};

        // 5. Iterate daily forecasts and match only the user’s workoutDays
        forecastData.daily.time.forEach((dateStr: string, index: number) => {
          const date = new Date(dateStr);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

          if (temp.workoutDays.includes(dayName)) {
            temp.weather[dayName] = {
              type: weatherCodeMap[forecastData.daily.weathercode[index]] || "Unknown",
              temperature: {
                min: forecastData.daily.temperature_2m_min[index],
                max: forecastData.daily.temperature_2m_max[index],
              },
              humidity: forecastData.daily.relative_humidity_2m_max[index],
            };
          }
        });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  } 
    // Remove extra SurveyData-only props before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hasExistingPlan, trainingForSpecific, selectedActivitiesEquipment, latitude, longitude, location,
      ...promptData
    } = temp;

    return promptData as PromptData;
  };

  // create LLM prompt based on surveyData && weather data
  const getWeeklyPlan = async () => {
    const data = await prepareSurveyData(surveyData);
    setPromptData(data);
    console.log('Prepared Prompt Data:', data); // Debugging line

    const raw_response = await getResponseFromLLM(JSON.stringify(data));
    console.log('LLM Response:', raw_response); // Debugging line
    
  };

  useEffect(() => {
    console.log('Survey Data:', surveyData); // Debugging line

    if (surveyData !== null) {
      getWeeklyPlan();
    }
    
  }, [surveyData]);


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Survey Summary</h2>
    </div>
  )
}