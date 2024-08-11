// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Load auth data from local storage if available
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  // Save auth data to local storage whenever it changes
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  // Axios instance with interceptors
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8088", // Replace with your backend API URL
  });

  // Request interceptor to add the access token to headers
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = auth?.accessToken;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post(
            "http://localhost:8088/refresh-token",
            {},
            { withCredentials: true }
          );
          setAuth((prev) => ({
            ...prev,
            accessToken: data.access_token, // Use the correct key from the response
          }));
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.access_token}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          setAuth(null);
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  const login = async (username, password) => {
    try {
      const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
      const response = await axiosInstance.post(
        "/sign-in",
        {},
        {
          headers: {
            Authorization: authHeader,
          },
          withCredentials: true,
        }
      );
      setAuth({
        accessToken: response.data.access_token, // Set the access token correctly
        username: username, // Store the username
      });
      return true; // Indicate successful login
    } catch (error) {
      console.error("Login failed:", error);
      return false; // Indicate failed login
    }
  };

  const value = {
    auth,
    login,
    axiosInstance, // expose the Axios instance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
