import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/users",
  headers: {
    "Content-Type": "application/json",
  },
});

// register
 const registerUser = async (userData) => {
    console.log(userData)
  const res = await API.post("/register", userData);
  return res.data;
};

// login
 const loginUser = async (userData) => {
    console.log(userData)
  const res = await API.post("/login", userData);
  return res.data;
};


export {registerUser,loginUser}