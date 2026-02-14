"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { initRootStore, RootStore } from "./RootStore";

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storeRef = useRef<RootStore | null>(null);

  storeRef.current ??= initRootStore();

  useEffect(() => {
    storeRef.current?.userStore.initAuthListener();

    return () => {
      storeRef.current?.userStore.destroy();
    };
  }, []);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useRootStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useRootStore must be used within StoreProvider");
  }
  return store;
};

export const useUserStore = () => useRootStore().userStore;
