"use client";

import React, { createContext, useState, useContext } from "react";

interface ModalContextType {
  openProfile: () => void;
  closeProfile: () => void;
  isProfileOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isProfileOpen, setProfileOpen] = useState(false);

  const openProfile = () => setProfileOpen(true);
  const closeProfile = () => setProfileOpen(false);

  return (
    <ModalContext.Provider value={{ isProfileOpen, openProfile, closeProfile }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
