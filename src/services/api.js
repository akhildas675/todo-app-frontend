import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/users",
  headers: {
    "Content-Type": "application/json",
  },
});





// register
const registerUser = async (userData) => {
  try {
    console.log('Registering user:', userData);
    const res = await API.post("/register", userData);
    return res.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Registration failed");
  }
};

// login 
const loginUser = async (userData) => {
  try {
    console.log('Logging in user:', userData);
    const res = await API.post("/login", userData);
    return res.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Login failed");
  }
};

export { registerUser, loginUser };