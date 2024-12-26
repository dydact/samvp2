import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  return (
    <AlertContext.Provider value={{ alerts, setAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);

// Wrap your main App component with AlertProvider

const AlertsNotifications: React.FC = () => {
  return (
    <div>
      <h1>Alerts and Notifications</h1>
      {/* Add content here */}
    </div>
  );
};

export default AlertsNotifications;