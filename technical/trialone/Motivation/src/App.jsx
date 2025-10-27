import Motivation from "./Component/Motivation";
import {BrowserRouter as Router, Route, Routes, BrowserRouter} from "react-router-dom";
// import Theme from "./Component/Theme";

function App() {
   return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Motivation />} />
      {/* <Route path="/theme" element={<Theme />} /> */}
    </Routes>
    </BrowserRouter>

      
    </>
  )
}

export default App
