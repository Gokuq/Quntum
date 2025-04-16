import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./components/AuthForm"; // Path to your AuthForm component
import Home from "./components/Home"; // Path to your Home component


function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Routes>
            <Route path="/" element={<AuthForm />} /> 
            <Route path="/home" element={<Home />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
