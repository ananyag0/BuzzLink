import React, { createContext, useState } from 'react';

const VisibilityContext = createContext();

const VisibilityProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <VisibilityContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export { VisibilityContext, VisibilityProvider };