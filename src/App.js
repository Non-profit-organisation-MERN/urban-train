import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
