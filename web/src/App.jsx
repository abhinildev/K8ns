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
    </Routes>
  </Router> 
  )
}

export default App
