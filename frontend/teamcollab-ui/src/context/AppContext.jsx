import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  return (
    <AppContext.Provider value={{ user, setUser, projects, setProjects }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
