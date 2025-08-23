import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const fetchCourses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/`,
        {
          credentials: "include",
          headers: {
            
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        return res.message;
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return { error: error.message };
    }
  };


  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/jobs/`,
        {
          credentials: "include",
          headers: {
            
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        return res.message;
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return { error: error.message };
    }
  };
  return (
    <AuthContext.Provider value={{ fetchCourses ,fetchJobs}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
