import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for the API
});

// Add authorization token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // Attach token to the request header
  }
  return req;
}, (error) => {
  // Handle any request errors
  return Promise.reject(error);
});

export default API;
