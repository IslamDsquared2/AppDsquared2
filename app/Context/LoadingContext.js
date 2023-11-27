"use client";

import React, { createContext, useState } from 'react';

export const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoader, setIsLoader] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoader, setIsLoader }}>
      {children}
    </LoadingContext.Provider>
  );
}