import Motivation from "./Component/Motivation";
import {BrowserRouter as Router, Route, Routes, BrowserRouter} from "react-router-dom";

function App() {
   return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Motivation />} />
    </Routes>
    </BrowserRouter>

      
    </>
  )
}

export default App
