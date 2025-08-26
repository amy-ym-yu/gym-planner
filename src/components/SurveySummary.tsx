import type { SurveyData } from '../pages/Survey'

interface SurveySummaryProps {
  surveyData: SurveyData
}

export default function SurveySummary({ surveyData }: SurveySummaryProps) {
    console.log('Survey Data:', surveyData); // Debugging line
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Survey Summary</h2>
    </div>
  )
}