
export default function Header() {
    return (
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-foreground">Laissez Fit</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-primary font-medium">
                  Workout Plans
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Exercises
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Activities
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Profile
                </a>
              </nav>
            </div>
          </div>
        </header>
    )
}