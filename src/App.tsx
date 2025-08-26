import { Routes, Route } from 'react-router-dom'
import { FitnessSurvey, Landing, Workouts } from './pages'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/survey" element={<FitnessSurvey />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </Layout>
  )
}

export default App
