import React from 'react';
import logo from './logo.svg';
import './App.css';

import Calendar from './components/calendar/calendar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Calendar />
    </div>
  );
}

export default App;
