// Mail.tsx - Email component
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Mail, X, Send, CheckCircle, AlertCircle } from "lucide-react";

interface WeeklyPlan {
  Monday: (Workout | Activity | string);
  Tuesday: (Workout | Activity | string);
  Wednesday: (Workout | Activity | string);
  Thursday: (Workout | Activity | string);
  Friday: (Workout | Activity | string);
  Saturday: (Workout | Activity | string);
  Sunday: (Workout | Activity | string);
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

interface Workout {
  name: string;
  time: number;
  weather?: any;
  activities: Exercise[];
}

interface MailComponentProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyPlan: WeeklyPlan;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

// Email service function
export const sendWorkoutPlanEmail = async (
  email: string, 
  weeklyPlan: WeeklyPlan
): Promise<EmailResponse> => {
  try {
    // Format the workout plan as HTML
    const formatWorkoutPlan = (plan: WeeklyPlan): string => {
      let html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Your Weekly Workout Plan</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Personalized fitness routine just for you</p>
          </div>
          <div style="padding: 30px 20px;">
      `;

      Object.entries(plan).forEach(([day, dayPlan]) => {
        html += `
          <div style="margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background: #f9fafb; padding: 15px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; color: #db2777; font-weight: 600;">${day}</h2>
            </div>
            <div style="padding: 20px;">
        `;

        if (typeof dayPlan === 'string') {
          html += `<p style="margin: 0; color: #6b7280; font-style: italic;">${dayPlan}</p>`;
        } else if ('activities' in dayPlan) {
          // Workout
          html += `
            <h3 style="margin: 0 0 15px 0; color: #db2777; font-size: 18px;">${dayPlan.name}</h3>
            <p style="margin: 0 0 15px 0; color: #6b7280;"><strong>Duration:</strong> ${dayPlan.time} minutes</p>
            <div style="margin-left: 20px;">
          `;
          dayPlan.activities.forEach((exercise: Exercise, index: number) => {
            html += `
              <div style="margin-bottom: 15px; padding-left: 15px; border-left: 3px solid #667eea; key=${index};">
                <h4 style="margin: 0 0 5px 0; color: #374151; font-weight: 600;">${exercise.name}</h4>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  ${exercise.duration} minutes • Break: ${exercise.break}s • Intensity: ${exercise.intensity}
                </p>
                ${exercise.description ? `<p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 13px;">${exercise.description}</p>` : ''}
              </div>
            `;
          });
          html += `</div>`;
        } else if ('equipment' in dayPlan) {
          // Activity
          html += `
            <h3 style="margin: 0 0 15px 0; color: #db2777; font-size: 18px;">${dayPlan.name}</h3>
            <p style="margin: 0 0 10px 0; color: #6b7280;"><strong>Duration:</strong> ${dayPlan.duration} minutes</p>
            ${dayPlan.equipment.length > 0 ? `<p style="margin: 0; color: #6b7280;"><strong>Equipment:</strong> ${dayPlan.equipment.join(', ')}</p>` : ''}
          `;
        }

        html += `
            </div>
          </div>
        `;
      });

      html += `
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Keep up the great work! Remember to listen to your body and adjust as needed.
            </p>
          </div>
        </div>
      `;

            html += `
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Keep up the great work! Remember to listen to your body and adjust as needed.
            </p>
          </div>
        </div>
      `;

      return html;
    };

    const emailData = {
      to: email,
      subject: 'Your Personalized Weekly Workout Plan',
      html: formatWorkoutPlan(weeklyPlan),
      text: `Your Weekly Workout Plan\n\n${Object.entries(weeklyPlan).map(([day, plan]) => 
        `${day}: ${typeof plan === 'string' ? plan : plan.name}`
      ).join('\n')}`
    };

    const url = import.meta.env.VITE_BACKEND_URL + '/api/email/send-email';
    console.log('Fetching URL:', url);
    const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return { success: true, message: 'Workout plan sent successfully!' };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    };
  }
};

export default function MailComponent({ isOpen, onClose, weeklyPlan }: MailComponentProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    const result = await sendWorkoutPlanEmail(email, weeklyPlan);
    
    setStatus({
      type: result.success ? 'success' : 'error',
      message: result.message
    });
    
    setIsLoading(false);

    if (result.success) {
      // Auto-close after success
      setTimeout(() => {
        setEmail('');
        setStatus({ type: null, message: '' });
        onClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setStatus({ type: null, message: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-lg sm:text-xl text-foreground">Email Your Plan</CardTitle>
            </div>
            <Button 
              size="default"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-shrink-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                required
              />
            </div>

            {status.type && (
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                status.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="text-sm">{status.message}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                type="submit" 
                disabled={isLoading || !email}
                className="flex-1 h-12 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Plan
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              Your workout plan will be sent as a beautifully formatted email with all exercise details, 
              durations, and equipment needed for each day.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}