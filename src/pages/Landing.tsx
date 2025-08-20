import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-card via-background to-muted py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6">Laissez Fit</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Your AI-powered fitness companion that adapts to your lifestyle
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your fitness journey with personalized training plans, smart nutrition guidance, and progress
            tracking that learns from your habits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
              Download App
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-3 text-lg bg-transparent"
            >
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
              Why Choose Laissez Fit?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of fitness with AI that understands your unique needs and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <CardTitle className="font-heading text-xl">AI Personal Trainer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Get personalized workout plans that adapt to your progress, preferences, and schedule in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🍎</span>
                </div>
                <CardTitle className="font-heading text-xl">Smart Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Receive meal recommendations and nutrition tracking that aligns with your fitness goals and dietary
                  preferences.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle className="font-heading text-xl">Progress Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Track your improvements with detailed analytics and insights that help you stay motivated and on
                  track.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <CardTitle className="font-heading text-xl">Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Workouts that fit your busy lifestyle with adaptive scheduling and quick session options.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="font-heading text-xl">Goal-Oriented</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Whether you want to lose weight, build muscle, or improve endurance, our AI creates targeted plans for
                  your goals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <CardTitle className="font-heading text-xl">Motivation & Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-card-foreground">
                  Stay motivated with achievement badges, progress celebrations, and personalized encouragement from
                  your AI trainer.
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
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already discovered the power of AI-driven fitness coaching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
              Get Started Today
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-4 text-lg bg-transparent"
            >
              Share Your Feedback
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Laissez Fit</h3>
          <p className="text-muted-foreground mb-6">Your AI fitness companion for a healthier, stronger you.</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
