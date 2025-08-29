
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Button } from '../components/ui/button'
import { Slider } from '../components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import LocationInput from '../components/survey/LocationInput'
import { Textarea } from "../components/ui/textarea"
import SurveySummary from '../components/survey/SurveySummary'

export interface SurveyData {
  fitnessLevel: string
  currentFitness: number[]
  biologicalSex?: string
  height?: string
  weight?: string
  activities: string[]
  hasExistingPlan?: string
  trainingForSpecific?: string
  goals: string[]
  planPreference: string
  varietyImportance: number[]
  interestedActivities: string[]
  selectedActivitiesEquipment?: { [key: string]: string }
  avoidActivities: string[]
  workoutFrequency: number[]
  workoutDays: string[]
  workoutDuration: string
  considerWeather: string
  location: string
  longitude?: number
  latitude?: number
  workoutPartner: string
  workoutTime: string
  additionalConsiderations: string
}

const fitnessLevels = [
  {
    id: "clean-slate",
    title: "Clean Slate",
    subtitle: "(occasional outdoor activity or workout)",
    description:
      "You're ready to get into the gym and build a routine. We'll figure out what types of activities you enjoy!",
  },
  {
    id: "in-the-zone",
    title: "In the Zone",
    subtitle: "(exercising 2-4x / week)",
    description:
      "You've got the hang of things, but maybe you're looking to spice things up or just add a few exercises. I'll be here to help you tune or tweak your plans!",
  },
  {
    id: "back-in-action",
    title: "Back in Action",
    subtitle: "(used to workout, but took a break)",
    description:
      "You've done this before, and you're ready to get back in there. We'll help you find your rhythm again, and maybe add a couple more tricks up your sleeve!",
  },
]

const activityCategories = {
  "Strength Training": ["Weight Lifting", "Body Weight Exercises", "Resistance Bands Exercises", "Kettlebell / Dumbbell Exercises"],
  Cardio: ["Running", "Cycling", "Swimming", "Walking"],
  "Studio Classes": ["Pilates", "Yoga", "Spin", "Barre", "Dance", "Zumba"],
  "Team Sports / Recreation": ["Basketball", "Soccer", "Tennis", "Rock Climbing", "Rowing"],
  "High Intensity Training": ["Crossfit", "HIIT", "Circuit Training"],
  "Outdoor Adventures": ["Standup Paddleboarding", "Hiking", "Trail Running", "Kayaking", "Skiing / Snowboarding"],
}

const fitnessLabels = [
  { value: 0, label: "No regular physical activity" },
  { value: 25, label: "Some weekend activities" },
  { value: 50, label: "Regular exercise routine" },
  { value: 75, label: "Fitness is a major lifestyle priority" },
  { value: 100, label: "Peak performance is my lifestyle" },
]


const goalOptions = [
  "Improve overall health (eg. reduce risk of disease, lower blood pressure, heart health)",
  "Build muscle",
  "Lose weight or body fat",
  "Stress relief or Mental health management",
  "Boost energy levels",
  "Improve confidence or self-esteem",
  "Improve sleep quality",
  "Develop functional strength (eg. carrying heavy groceries/luggage/boxes, walking uphill/stairs easier)",
]

const planPreferences = [
  {
    id: "result-focused",
    title: "Result focused & Time-efficient",
    description: "I would like to see results as soon as possible and spend the least amount of time in the gym.",
  },
  {
    id: "variety-enjoyment",
    title: "Variety & Enjoyment",
    description: "I want as much variation as possible while doing workouts and activities that I enjoy.",
  },
  {
    id: "challenging-progressive",
    title: "Challenging & Progressive",
    description: "I like a challenge, and I'm okay with doing the same plan as long as it increases in difficulty.",
  },
  {
    id: "guidance-accountability",
    title: "Guidance & Accountability",
    description: "I would like someone to assist me throughout and keep me accountable.",
  },
  {
    id: "anywhere-straightforward",
    title: "Anywhere & Straight forward",
    description: "I want to be able to do a simple workout anywhere (as little equipment as possible).",
  },
]

const varietyLabels = [
  { value: 0, label: "I could do the same thing forever" },
  { value: 25, label: "I like a routine, but I need to spice things up every so often" },
  { value: 50, label: "I like a routine, but I like to try new things too!" },
  { value: 75, label: "I can't do the same thing for more than a month or I get bored" },
  { value: 100, label: "I want something new every week" },
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const workoutDurations = ["0-30 minutes", "30-60 minutes", "60-90 minutes", "1.5+ hrs", "Doesn't matter!"]

const workoutPartnerOptions = ["Alone", "With a partner", "In small groups", "In large classes", "No preference"]

const workoutTimeOptions = [
  "Early morning (4-7 AM)",
  "Morning (7-10 AM)",
  "Mid-Day (10 AM - 2 PM)",
  "Afternoon (2-6 PM)",
  "Evening (6-9 PM)",
  "Night (9+ PM)",
]

const helpfulResources = [
  {
    title: "Couch to 5K Program",
    description: "A popular beginner-friendly running program",
    link: "https://www.c25k.com"
  },
  {
    title: "Hal Higdon Training Plans",
    description: "Comprehensive marathon, half-marathon and Triathlon training plans",
    link: "https://www.halhigdon.com"
  },
  {
    title: "TrainingPeaks",
    description: "Professional training plans for various endurance sports",
    link: "https://www.trainingpeaks.com"
  },
  {
    title: "Strava Training",
    description: "Community-driven training plans and tracking",
    link: "https://www.strava.com"
    },
  {
    title: "REI's Backpacking Training Plan",
    description: "A simple guide with exercises and demos to prepare for any backpacking trip",
    link: "https://www.rei.com/learn/expert-advice/conditioning-backpacking.html"
  }
]

function FitnessSurvey() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showFeatureUnavailable, setShowFeatureUnavailable] = useState(false)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    fitnessLevel: "",
    currentFitness: [50],
    biologicalSex: "",
    height: "",
    weight: "",
    activities: [],
    hasExistingPlan: "",
    trainingForSpecific: "",
    goals: [],
    planPreference: "",
    varietyImportance: [50],
    interestedActivities: [],
    selectedActivitiesEquipment: {},
    avoidActivities: [],
    workoutFrequency: [3],
    workoutDays: [],
    workoutDuration: "",
    considerWeather: "",
    location: "",
    workoutPartner: "",
    workoutTime: "",
    additionalConsiderations: "",
  })

  const totalSteps = 12
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    // Check if user answered "yes" to either question in step 5
    if (currentStep === 5 && (surveyData.hasExistingPlan === "yes" || surveyData.trainingForSpecific === "yes")) {
      setShowFeatureUnavailable(true)
      return
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleActivityToggle = (activity: string) => {
    setSurveyData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : prev.activities.length < 10
          ? [...prev.activities, activity]
          : prev.activities,
    }))
  }

  const handleGoalToggle = (goal: string) => {
    setSurveyData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : prev.goals.length < 3
          ? [...prev.goals, goal]
          : prev.goals,
    }))
  }

  const handleInterestedActivityToggle = (activity: string) => {
    setSurveyData((prev) => ({
      ...prev,
      interestedActivities: prev.interestedActivities.includes(activity)
        ? prev.interestedActivities.filter((a) => a !== activity)
        : prev.interestedActivities.length < 10
          ? [...prev.interestedActivities, activity]
          : prev.interestedActivities,
    }))
  }

  const handleAvoidActivityToggle = (activity: string) => {
    setSurveyData((prev) => ({
      ...prev,
      avoidActivities: prev.avoidActivities.includes(activity)
        ? prev.avoidActivities.filter((a) => a !== activity)
        : [...prev.avoidActivities, activity],
    }))
  }

  const handleWorkoutDayToggle = (day: string) => {
    setSurveyData((prev) => ({
      ...prev,
      workoutDays: prev.workoutDays.includes(day)
        ? prev.workoutDays.filter((d) => d !== day)
        : [...prev.workoutDays, day],
    }))
  }

  const handleRestartSurvey = () => {
    setShowFeatureUnavailable(false)
    setSurveyData((prev) => ({
      ...prev,
      hasExistingPlan: "",
      trainingForSpecific: ""
    }))
  }
  
  useEffect(() => {
    console.log("Survey Data for Step", currentStep, ":", surveyData);
  }, [currentStep]);

  // Show feature unavailable message if user answered yes to either question
  if (showFeatureUnavailable) {
    return (
      <div className="min-h-screen bg-base-100 py-8 px-4 overscroll-auto">
        {/* Fixed overlay with flex centering that allows scrolling */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 max-h-[90vh] overflow-y-auto">
              <button 
                type="button" 
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white z-10"
                onClick={() => setShowFeatureUnavailable(false)}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              
              <div className="p-6 md:p-8 text-center">
                <svg className="mx-auto mb-4 text-amber-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                
                <h3 className="mb-5 text-2xl font-semibold text-amber-600">Feature Currently Unavailable</h3>
                
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-justify">
                    Sorry about that! We haven't fully built out features that would support existing training plans or specific event training at this time.
                    <span className="block mt-2"></span>
                    We wouldn't want to derail your progress with a subpar experience. We're working hard to add more features and improve the experience.
                  </p>
                </div>
                
                <div className="text-left mb-6">
                  <h4 className="text-lg font-semibold mb-4 text-center">Here are some helpful resources that might assist you:</h4>
                  <div className="space-y-3">
                    {helpfulResources.map((resource, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <h5 className="font-medium text-blue-600 mb-1">{resource.title}</h5>
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Visit Website →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    If you'd like to continue with our general fitness planning, you can go back to the survey and select "No" for the training questions.
                  </p>
                  <button 
                    onClick={handleRestartSurvey} 
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3"
                  >
                    Return to Survey
                  </button>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">Meet Your AI Coach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏋️‍♀️</span>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Hi there! My name is <strong className="text-foreground">Coach Leah</strong>. I'm your AI personal
                  trainer. I'm excited to learn more about where you are in your fitness journey, what you're looking to
                  accomplish and what activities you like to do!
                </p>
                <p className="text-muted-foreground mb-4">
                  At the end of this survey, you will have a customized workout plan for the coming week. I can take
                  into account your preferences, the weather conditions and any events you need to work around! Don't
                  worry, you can always change any part of this plan later. That's why I'm here :)
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Where are you in your fitness journey?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={surveyData.fitnessLevel}
                onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, fitnessLevel: value }))}
                className="space-y-4"
              >
                {fitnessLevels.map((level) => (
                  <div
                    key={level.id}
                    className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={level.subtitle} id={level.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={level.id} className="text-base font-semibold cursor-pointer">
                        {level.title} <span className="text-muted-foreground font-normal">{level.subtitle}</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">How would you rate your current fitness?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="px-4">
                <Slider
                  value={surveyData.currentFitness}
                  onValueChange={(value: number[]) => setSurveyData((prev) => ({ ...prev, currentFitness: value }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{surveyData.currentFitness[0]}</div>
                <p className="text-muted-foreground">
                  {fitnessLabels.find((label) => Math.abs(label.value - surveyData.currentFitness[0]) <= 12.5)?.label ||
                    "Custom fitness level"}
                </p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {fitnessLabels.map((label) => (
                  <div key={label.value} className="flex justify-between">
                    <span>{label.value}</span>
                    <span>{label.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

        case 3:
        return (
            <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Optional Information</CardTitle>
                <CardDescription>
                The next three questions are completely optional. If you do not want to disclose, you do not have to!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                <Label className="text-base font-semibold">What is your biological sex? (optional)</Label>
                <Select
                    value={surveyData.biologicalSex}
                    onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, biologicalSex: value }))}
                >
                    <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="none">Prefer not to say</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="intersex">Intersex</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div>
                <Label className="text-base font-semibold">What is your height? (optional)</Label>
                <Select
                    value={surveyData.height}
                    onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, height: value }))}
                >
                    <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                    <SelectItem value="none">Prefer not to say</SelectItem>
                    {Array.from({ length: 73 }, (_, i) => {
                        const inches = i + 48 // 4'0" to 8'0" (more realistic range)
                        const feet = Math.floor(inches / 12)
                        const remainingInches = inches % 12
                        const cmEquivalent = Math.round(inches * 2.54)
                        return (
                        <SelectItem key={inches} value={`${feet}'${remainingInches}"`}>
                            {feet}'{remainingInches}" ({cmEquivalent} cm)
                        </SelectItem>
                        )
                    })}
                    </SelectContent>
                </Select>
                </div>

                <div>
                <Label className="text-base font-semibold">What is your weight? (optional)</Label>
                <Select
                    value={surveyData.weight}
                    onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, weight: value }))}
                >
                    <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                    <SelectItem value="none">Prefer not to say</SelectItem>
                    {Array.from({ length: 350 }, (_, i) => {
                        const lbs = i + 50 // 50-400 lbs (more realistic range)
                        const kg = Math.round(lbs / 2.205)
                        return (
                        <SelectItem key={lbs} value={`${lbs} lbs`}>
                            {lbs} lbs ({kg} kg)
                        </SelectItem>
                        )
                    })}
                    </SelectContent>
                </Select>
                </div>
            </CardContent>
            </Card>
        )

      case 4:
        return (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">What activities do you currently do or enjoy doing?</CardTitle>
              <CardDescription>Select up to 10 activities ({surveyData.activities.length}/10 selected)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Object.entries(activityCategories).map(([category, activities]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-4 text-primary">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activities.map((activity) => (
                        <div key={activity} className="flex items-center space-x-2">
                          <Checkbox
                            id={activity}
                            checked={surveyData.activities.includes(activity)}
                            onCheckedChange={() => handleActivityToggle(activity)}
                            disabled={!surveyData.activities.includes(activity) && surveyData.activities.length >= 10}
                          />
                          <Label htmlFor={activity} className="text-sm cursor-pointer">
                            {activity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Determining Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">
                  Do you have a plan, split or schedule you want to follow?
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  It's okay to say no! We just want to make sure we're not derailing your progress.
                </p>
                <RadioGroup
                  value={surveyData.hasExistingPlan}
                  onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, hasExistingPlan: value }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="plan-yes" />
                    <Label htmlFor="plan-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="plan-no" />
                    <Label htmlFor="plan-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Are you training for something specific?</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  (eg. 5k, any type of marathon or triathlon, biking or backpacking trip)
                </p>
                <RadioGroup
                  value={surveyData.trainingForSpecific}
                  onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, trainingForSpecific: value }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="training-yes" />
                    <Label htmlFor="training-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="training-no" />
                    <Label htmlFor="training-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Motivation & Plan Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Label className="text-base font-semibold mb-4 block">What are your goals? (select up to 3)</Label>
                <p className="text-sm text-muted-foreground mb-4">Selected: {surveyData.goals.length}/3</p>
                <div className="space-y-3">
                  {goalOptions.map((goal) => (
                    <div key={goal} className="flex items-start space-x-2">
                      <Checkbox
                        id={goal}
                        checked={surveyData.goals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                        disabled={!surveyData.goals.includes(goal) && surveyData.goals.length >= 3}
                      />
                      <Label htmlFor={goal} className="text-sm cursor-pointer leading-relaxed">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">
                  What's most important in your workout plan? (select 1)
                </Label>
                <RadioGroup
                  value={surveyData.planPreference}
                  onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, planPreference: value }))}
                  className="space-y-4"
                >
                  {planPreferences.map((pref) => (
                    <div
                      key={pref.id}
                      className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={pref.id} id={pref.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={pref.id} className="text-base font-semibold cursor-pointer">
                          {pref.title}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{pref.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )

      case 7:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">How important is variety in your workouts?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="px-4">
                <Slider
                  value={surveyData.varietyImportance}
                  onValueChange={(value: number[]) => setSurveyData((prev) => ({ ...prev, varietyImportance: value }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{surveyData.varietyImportance[0]}</div>
                <p className="text-muted-foreground">
                  {varietyLabels.find((label) => Math.abs(label.value - surveyData.varietyImportance[0]) <= 12.5)
                    ?.label || "Custom variety preference"}
                </p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {varietyLabels.map((label) => (
                  <div key={label.value} className="flex justify-between">
                    <span>{label.value}</span>
                    <span>{label.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 8:
        return (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Activity Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  What types of activities are you interested in participating in? (Select up to 10)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selected: {surveyData.interestedActivities.length}/10
                </p>
                <div className="space-y-6">
                  {Object.entries(activityCategories).map(([category, activities]) => (
                    <div key={category}>
                      <h4 className="text-base font-semibold mb-3 text-primary">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activities.map((activity) => (
                          <div key={activity} className="flex items-center space-x-2">
                            <Checkbox
                              id={`interested-${activity}`}
                              checked={surveyData.interestedActivities.includes(activity)}
                              onCheckedChange={() => handleInterestedActivityToggle(activity)}
                              disabled={
                                !surveyData.interestedActivities.includes(activity) &&
                                surveyData.interestedActivities.length >= 10
                              }
                            />
                            <Label htmlFor={`interested-${activity}`} className="text-sm cursor-pointer">
                              {activity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Are there any activities you don't want to do or are limited from doing?
                </h3>
                <div className="space-y-6">
                  {Object.entries(activityCategories).map(([category, activities]) => (
                    <div key={category}>
                      <h4 className="text-base font-semibold mb-3 text-primary">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activities.map((activity) => (
                          <div key={activity} className="flex items-center space-x-2">
                            <Checkbox
                              id={`avoid-${activity}`}
                              checked={surveyData.avoidActivities.includes(activity)}
                              onCheckedChange={() => handleAvoidActivityToggle(activity)}
                            />
                            <Label htmlFor={`avoid-${activity}`} className="text-sm cursor-pointer">
                              {activity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 9:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Logistics & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Label className="text-base font-semibold mb-4 block">
                  How many times do you want to work out per week?
                </Label>
                <div className="px-4">
                  <Slider
                    value={surveyData.workoutFrequency}
                    onValueChange={(value: number[]) => setSurveyData((prev) => ({ ...prev, workoutFrequency: value }))}
                    min={1}
                    max={7}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="text-2xl font-bold text-primary">{surveyData.workoutFrequency[0]} times per week</div>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">What days do you plan to workout?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={surveyData.workoutDays.includes(day)}
                        onCheckedChange={() => handleWorkoutDayToggle(day)}
                      />
                      <Label htmlFor={day} className="text-sm cursor-pointer">
                        {day.slice(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">
                  What is your preferred duration for a workout?
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  We are excluding activities that vary on what trail or route you're on (eg. skiing/snowboarding,
                  kayaking, etc)
                </p>
                <RadioGroup
                  value={surveyData.workoutDuration}
                  onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, workoutDuration: value }))}
                  className="space-y-2"
                >
                  {workoutDurations.map((duration) => (
                    <div key={duration} className="flex items-center space-x-2">
                      <RadioGroupItem value={duration} id={duration} />
                      <Label htmlFor={duration} className="text-sm cursor-pointer">
                        {duration}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">
                  Would you like me to consider the weather when planning?
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  If you like to do outdoor activities, you may want me to consider the weather, but you can also tell
                  me when you want to do things once we have your profile.
                </p>
                <RadioGroup
                  value={surveyData.considerWeather}
                  onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, considerWeather: value }))}
                  className="flex gap-4 mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="weather-yes" />
                    <Label htmlFor="weather-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="weather-no" />
                    <Label htmlFor="weather-no">No</Label>
                  </div>
                </RadioGroup>
                <LocationInput
                  surveyData={surveyData}
                  setSurveyData={setSurveyData}
                />
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">
                  Do you like to workout with others or by yourself?
                </Label>
                <RadioGroup
                  value={surveyData.workoutPartner}
                  onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, workoutPartner: value }))}
                  className="space-y-2"
                >
                  {workoutPartnerOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="text-sm cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">What time of day do you like working out?</Label>
                <RadioGroup
                  value={surveyData.workoutTime}
                  onValueChange={(value: string) => setSurveyData((prev) => ({ ...prev, workoutTime: value }))}
                  className="space-y-2"
                >
                  {workoutTimeOptions.map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <RadioGroupItem value={time} id={time} />
                      <Label htmlFor={time} className="text-sm cursor-pointer">
                        {time}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )

      case 10:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Final Thoughts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">
                  Alrighty, I think I have everything I need. Is there anything else you want me to consider?
                </Label>
                <Textarea
                  placeholder="Share any additional considerations, preferences, or goals..."
                  value={surveyData.additionalConsiderations}
                  onChange={(e) => setSurveyData((prev) => ({ ...prev, additionalConsiderations: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        )
      
      case 11:
        return (<SurveySummary surveyData={surveyData}/>)

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        {renderStep()}

        {/* Navigation Buttons */}
        {currentStep < totalSteps-1 ? (
          <div className="flex justify-between mt-8 max-w-2xl mx-auto">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === (totalSteps - 2) ? "Complete Survey" : "Next"}
            </Button>
          </div>
        ): <></>}

      </div>
    </div>
  )
}

export default FitnessSurvey;
