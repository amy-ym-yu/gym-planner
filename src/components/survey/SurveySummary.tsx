import type { SurveyData } from '../../pages/Survey'
import { useState, useEffect } from "react"
import { getResponseFromLLM } from '../survey/llmEndpoint';
// import example_response from '../survey/example_response.txt?raw';
import Mail from './Mail';

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Clock, Dumbbell, Activity, Calendar, Mail as MailIcon } from "lucide-react"

interface SurveySummaryProps {
  surveyData: SurveyData
}

interface PromptData {
  fitnessLevel: string;
  currentFitness: number[];
  biologicalSex?: string;
  height?: string;
  weight?: string;
  activities: string[];
  goals: string[];
  planPreference: string;
  varietyImportance: number[];
  interestedActivities: string[];
  avoidActivities: string[];
  workoutFrequency: number[];
  workoutDays: string[];
  workoutDuration: string;
  considerWeather: string;
  weather?: Weather[];
  workoutPartner: string;
  workoutTime: string;
  additionalConsiderations?: string;
}

interface Exercise {
    name: string;
    duration: number;
    break: number;
    intensity: string;
    description: string;
    muscleGroups: string[];
    equipment: string[];
}

interface Activity {
    name: string;
    duration: number;
    equipment: string[];
}

interface Weather {
    type: string;
    temperature: {
        min: number;
        max: number;
    };
    humidity: number;
}

interface Workout {
    name: string;
    time: number;
    weather?: Weather | null;
    activities: Exercise[];
}

interface WeeklyPlan {
    Monday: (Workout | Activity | string);
    Tuesday: (Workout | Activity | string);
    Wednesday: (Workout | Activity | string);
    Thursday: (Workout | Activity | string);
    Friday: (Workout | Activity | string);
    Saturday: (Workout | Activity | string);
    Sunday: (Workout | Activity | string);
}

export default function SurveySummary({ surveyData }: SurveySummaryProps) {
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState<keyof WeeklyPlan | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const prepareSurveyData = async (data: SurveyData): Promise<PromptData> => {
    const temp: any = { ...data };

    if (temp.hasExistingPlan === "no") delete temp.hasExistingPlan;
    if (temp.trainingForSpecific === "no") delete temp.trainingForSpecific;

    if (
      temp.selectedActivitiesEquipment &&
      Object.values(temp.selectedActivitiesEquipment).includes("none")
    ) {
      delete temp.selectedActivitiesEquipment;
    }

    // const weatherArray: Weather[] = [];

    if (temp.considerWeather === "yes" && temp.latitude && temp.longitude && temp.workoutDays?.length) {
      try {
        const today = new Date();
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));

        const startDate = nextMonday.toISOString().split("T")[0];
        const endDate = new Date(nextMonday);
        endDate.setDate(nextMonday.getDate() + 6);
        const endDateStr = endDate.toISOString().split("T")[0];

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${temp.latitude}&longitude=${temp.longitude}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,weathercode&timezone=auto&temperature_unit=fahrenheit&start_date=${startDate}&end_date=${endDateStr}`;

        const res = await fetch(url);
        const forecastData = await res.json();

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

        temp.weather = {};

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

    const { hasExistingPlan, trainingForSpecific, selectedActivitiesEquipment, latitude, longitude, location,
      ...promptData
    } = temp;

    return promptData as PromptData;
  };
  
  function parseWeeklyPlan(markdown: string): WeeklyPlan {
      // const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const plan: Partial<WeeklyPlan> = {};

      const daySections = markdown.split(/# (Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/g);

      for (let i = 1; i < daySections.length; i += 2) {
          const day = daySections[i] as keyof WeeklyPlan;
          const content = daySections[i + 1].trim();

          if (/no activity/i.test(content) || content === "") {
              plan[day] = "no activity";
              continue;
          }

          const titleMatch = content.match(/^# (.+)/m);
          const durationMatch = content.match(/Duration:\s*(\d+)\s*minutes/i);

          if (content.includes("Equipment:")) {
              const equipmentMatches = [...content.matchAll(/\* (.+)/g)].map(m => m[1]);
              plan[day] = {
                  name: titleMatch ? titleMatch[1] : "Unknown Activity",
                  duration: durationMatch ? parseInt(durationMatch[1]) : 0,
                  equipment: equipmentMatches
              } as Activity;
          } else {
              const exerciseBlocks = content.split(/\* /g).slice(1);
              const exercises: Exercise[] = exerciseBlocks.map(block => {
                  const lines = block.split("\n").map(l => l.trim()).filter(l => l.length > 0);

                  const name = lines[0];
                  
                  // Look for reps/sets pattern in the exercise block
                  const setRepMatch = block.match(/(\d+)\s*(reps|steps|seconds|minutes).*x\s*(\d+)/i);
                  const duration = setRepMatch ? parseInt(setRepMatch[1]) : 0;

                  // Look for break information within this exercise block
                  const breakMatch = block.match(/>\s*Break:\s*(\d+)\s*seconds/i);
                  const breakTime = breakMatch ? parseInt(breakMatch[1]) : 0;

                  return {
                      name,
                      duration,
                      break: breakTime,
                      intensity: "medium",
                      description: "",
                      muscleGroups: [],
                      equipment: []
                  };
              });

              plan[day] = {
                  name: titleMatch ? titleMatch[1] : "Unknown Workout",
                  time: durationMatch ? parseInt(durationMatch[1]) : 0,
                  weather: null,
                  activities: exercises
              } as Workout;
          }
      }
      console.log('Parsed Weekly Plan:', plan);
      return plan as WeeklyPlan;
  }

  const getWeeklyPlan = async () => {
    const data = await prepareSurveyData(surveyData);
    setPromptData(data);
    console.log('Prepared Prompt Data:', data);

    const raw_response = await getResponseFromLLM(JSON.stringify(data));
    setResponse(raw_response);
    console.log('Raw LLM Response:', raw_response);
    const parsed_response = parseWeeklyPlan(raw_response);

    // setResponse(example_response);
    // console.log('LLM Response:', example_response);
    // const parsed_response = parseWeeklyPlan(example_response);
    setWeeklyPlan(parsed_response);
  };

  useEffect(() => {
    console.log('Survey Data:', surveyData);

    if (surveyData !== null) {
      getWeeklyPlan();
    }
  }, [surveyData]);

  useEffect(() => {
    console.log('Prompt Data:', promptData);
  }, [promptData]);

    useEffect(() => {
    console.log('Response:', response);
  }, [response]);

  if (weeklyPlan === null) {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {/* Weekly Plan Overview */}
        <section className="flex flex-col flex-shrink-0 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center sm:text-left">Your Weekly Workout Plan</h2>
            </div>
            {weeklyPlan && (
              <Button 
                onClick={() => setShowEmailModal(true)}
                className="flex items-center gap-2 w-fit mx-auto sm:mx-0"
              >
                <MailIcon className="h-4 w-4" />
                Email Plan
              </Button>
            )}
          </div>
          
          {weeklyPlan && (
            <div className="flex flex-nowrap justify-center gap-3 sm:gap-4 lg:gap-6">
              {Object.entries(weeklyPlan).map(([day, dayPlan]) => (
                <Card 
                  key={day} 
                  className={`flex-1 min-w-[120px] max-w-[180px] text-center hover:shadow-lg transition-all cursor-pointer ${
                    selectedDay === day ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedDay(day as keyof WeeklyPlan)}
                >
                  <CardHeader className="flex-shrink-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">{day}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center pt-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground text-balance leading-relaxed">
                      {typeof dayPlan === 'string' 
                        ? dayPlan 
                        : dayPlan.name
                      }
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Selected Day Details */}
        <section className="flex flex-col flex-1 px-4 sm:px-6 lg:px-8 pb-8">
          {selectedDay && weeklyPlan ? (
            <>
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-8">
                <Dumbbell className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center sm:text-left">
                  {selectedDay}'s Plan
                </h2>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {(() => {
                  const selectedWorkout = weeklyPlan[selectedDay];
                  
                  if (typeof selectedWorkout === 'object' && 'activities' in selectedWorkout) {
                    // Workout with exercises
                    return (
                      <Card className="w-full max-w-4xl mx-auto shadow-lg">
                        <CardHeader className="flex-shrink-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-lg sm:text-xl lg:text-2xl text-foreground text-center sm:text-left">{selectedWorkout.name}</CardTitle>
                            <Badge variant="secondary" className="flex items-center justify-center gap-2 w-fit mx-auto sm:mx-0">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="text-xs sm:text-sm">{selectedWorkout.time} mins</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-6">
                          <div className="flex flex-col gap-4">
                            {selectedWorkout.activities.map((exercise, index) => (
                              <div key={index} className="border-l-4 border-primary flex flex-col gap-2 pl-4 sm:pl-6 py-3">
                                <h4 className="font-semibold text-foreground text-sm sm:text-base">{exercise.name}</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Activity className="h-3 w-3 flex-shrink-0" />
                                    {exercise.duration} minutes
                                  </span>
                                  <span>Break: {exercise.break}s after</span>
                                  <span>Intensity: {exercise.intensity}</span>
                                </div>
                                {exercise.description && (
                                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
                                )}
                                {exercise.equipment.length > 0 && (
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    <span className="font-medium">Equipment:</span> {exercise.equipment.join(', ')}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  } else if (typeof selectedWorkout === 'object' && 'equipment' in selectedWorkout) {
                    // Activity
                    return (
                      <Card className="w-full max-w-4xl mx-auto shadow-lg">
                        <CardHeader className="flex-shrink-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-lg sm:text-xl lg:text-2xl text-foreground text-center sm:text-left">{selectedWorkout.name}</CardTitle>
                            <Badge variant="secondary" className="flex items-center justify-center gap-2 w-fit mx-auto sm:mx-0">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="text-xs sm:text-sm">{selectedWorkout.duration} mins</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-6">
                          <div className="border-l-4 border-primary flex flex-col gap-2 pl-4 sm:pl-6 py-3">
                            <h4 className="font-semibold text-foreground text-sm sm:text-base">Activity Details</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3 flex-shrink-0" />
                                {selectedWorkout.duration} minutes
                              </span>
                              {selectedWorkout.equipment.length > 0 && (
                                <span>Equipment: {selectedWorkout.equipment.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  } else {
                    // Rest day or no activity
                    return (
                      <Card className="w-full max-w-2xl mx-auto shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center text-center py-12 sm:py-16 gap-6">
                          <Activity className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground flex-shrink-0" />
                          <div className="flex flex-col gap-3">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Rest Day</h3>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                              {typeof selectedWorkout === 'string' ? selectedWorkout : 'Take a well-deserved break today!'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                })()}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
              <Calendar className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col gap-3">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Select a Day</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                  Click on any day above to view the detailed workout plan for that day.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Email Modal */}
        {weeklyPlan && (
          <Mail 
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            weeklyPlan={weeklyPlan}
          />
        )}
      </div>
    </div>
  );
}