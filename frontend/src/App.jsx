import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Meeting } from './pages/meeting'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/meeting' element={<Meeting />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
