import { Routes, Route } from 'react-router-dom'
import { Landing, Workouts } from './pages'
import './App.css'

function App() {
  return (
    <div className="app">      
      <main className="main-content justify-center">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
