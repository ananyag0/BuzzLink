import { useState } from 'react'
import './App.css'
import Chatroom from './chatroom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      Hello World with count: 
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Chatroom />
    </div>
  )
}

export default App
