import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/users",
  headers: {
    "Content-Type": "application/json",
  },
});

// register
export const registerUser = async (userData) => {
    console.log(userData)
  const res = await API.post("/register", userData);
  return res.data;
};

// login
export const loginUser = async (userData) => {
    console.log(userData)
  const res = await API.post("/login", userData);
  return res.data;
};
