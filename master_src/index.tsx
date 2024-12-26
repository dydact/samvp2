import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App'; // Import App.tsx

// Set dev mode based on your environment or build configuration
if (process.env.NODE_ENV === 'development') {
  window.__DEV_MODE__ = true;
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App /> {/* Render App.tsx */}
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
