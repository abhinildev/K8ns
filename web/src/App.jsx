import Dashboard from "./components/Dashboard"
import Hero from "./components/Hero"

import Navbar from "./components/Navbar"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
function App() {
  
  return (
  <Router>
    <Routes>
      <Route path="/" element={
        <>
       <Navbar/>
        <Hero/>
       
        </>
      }/>
       <Route path="/dashboard" element={<Dashboard/>} />
     
    </Routes>
   
  </Router> 
  )
}

export default App
