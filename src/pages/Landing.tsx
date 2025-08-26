import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

import trainerIcon from "../assets/ai-trainer.png"
import weeklyIcon from "../assets/weekly-plan.png"
import feedbackIcon from "../assets/feedback.png"
import bikingIcon from "../assets/biking.png"
import learningIcon from "../assets/learn.png"
import remindIcon from "../assets/remind.png"

import { useNavigate } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate();

  const goToSurvey = () => {
    navigate("/survey");
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-card via-background to-muted py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6">LaissezFit</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Letting you do fitness journey your way
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your fitness journey with personalized AI training plans without the rigidity of traditional fitness plans!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg" onClick={goToSurvey}>
              Take Our Survey
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Use Laissez fit?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escape from rigid traditional gym plans. Roll with the punches of life and allow yourself to adapt your workout routine!
            </p>
            <br></br>
            <p className="text-accent-foreground text-lg">Meet your AI Personal Trainer, <b className="text-primary-intense">Coach Leah</b>!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <img src={trainerIcon}/>
                </div>
                <CardTitle className="font-heading text-xl">Your Knowledgable Gym Buddy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Coach Leah builds workouts around your favorites, syncs with your schedule, and even factors in the weather!
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <img src={weeklyIcon} />
                </div>
                <CardTitle className="font-heading text-xl">Adapt on the Fly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Fitness is about showing up, not perfecting the numbers! Coach Leah instantly swaps workouts when life happens or you need a change.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <img src={bikingIcon} />
                </div>
                <CardTitle className="font-heading text-xl">Any Activity, Anytime</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Love biking? Paddle boarding? Rock climbing?
                  Just tell Coach Leah what you're craving and they'll make it work!
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <img src={learningIcon}/>
                </div>
                <CardTitle className="font-heading text-xl">Learn as You Go</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  New excercise? Don't sweat it. Get demos for new activities. Coah Leah shows you exactly what you need, when you need it.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <img src={feedbackIcon}/>
                </div>
                <CardTitle className="font-heading text-xl">Rate & Remember</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Coach Leah remembers your favorites and ditches what you hate!
                  Crave variety or love routine? It's your call.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <img src={remindIcon} />
                </div>
                <CardTitle className="font-heading text-xl">Keep You Accountable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Coach Leah will send weekly reminders to review your plan, celebrate your wins & check-in after missed workouts!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Make Fitness Yours?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Life doesn't always go according to plan. Let's embrace the flow and make fitness work for you!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg" onClick={goToSurvey}>
              Meet AI Coach Leah today!
            </Button>
            {/* <Button
              variant="outline"
              size="lg"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-4 text-lg bg-transparent"
            >
              Share Your Feedback
            </Button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Laissez Fit</h3>
          <p className="text-muted-foreground mb-6">Make fitness for work for everyone.</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            {/* <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact Us
            </a> */}
          </div>
        </div>
      </footer>
    </div>
  )
}
