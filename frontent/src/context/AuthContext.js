import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      setUser(response.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
