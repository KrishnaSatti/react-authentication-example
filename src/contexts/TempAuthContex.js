// // src/context/AuthContext.js
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useLayoutEffect,
//   useState,
// } from "react";
// import axios from "axios";

// export const AuthContext = createContext(undefined);

// export const useAuth = () => {
//   const authContext = useContext(AuthContext);

//   if (!authContext) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return authContext;
// };

// const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState();

//   // Axios instance with interceptors
//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:8088", // Replace with your backend API URL
//   });

//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const response = await axios.get("/api/welcome-message");
//         setToken(response.data.access_token);
//       } catch (error) {
//         setToken(null);
//       }
//     };

//     fetchMe();
//   }, []);

//   useLayoutEffect(() => {
//     const authInterceptor = axiosInstance.interceptors.request.use((config) => {
//       config.headers.Authorization =
//         !config._retry && token
//           ? `Bearer ${token}`
//           : config.headers.Authorization;
//       return config;
//     });

//     return () => {
//       axiosInstance.interceptors.request.eject(authInterceptor);
//     };
//   }, [token]);

//   useLayoutEffect(() => {
//     const refreshInterceptor = axiosInstance.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;

//         if (
//           error.response.status === 401 &&
//           error.response.data.message === "Unauthorized"
//         ) {
//           try {
//             const response = await axios.post("/api/refresh-token");

//             setToken(response.data.access_token);

//             originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
//             originalRequest._retry = true;

//             return axiosInstance(originalRequest);
//           } catch (error) {
//             setToken(null);
//           }
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosInstance.interceptors.response.eject(refreshInterceptor);
//     };
//   }, []);
// };

// export default AuthProvider;
