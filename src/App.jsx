import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouterComponent from "./routes/Router.jsx";
function App() {
  return (
    <Router>
      <main className="font-poppins">
        <RouterComponent />
      </main>
    </Router>
  );
}

export default App;
