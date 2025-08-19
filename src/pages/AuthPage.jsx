import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, registerSuccess } from "../features/auth/authSlice";
import { loginUser, registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      navigate("/home");
    }
  }, [isAuthenticated, token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data;
      
      if (isLogin) {
       
        if (!formData.email.trim() || !formData.password.trim()) {
          throw new Error("Email and password are required");
        }
        
        data = await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        });
        
        dispatch(loginSuccess(data));
      } else {
       
        if (!formData.username.trim()) {
          throw new Error("Username is required");
        }
        if (!formData.email.trim() || !formData.password.trim()) {
          throw new Error("All fields are required");
        }
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        
        data = await registerUser({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
        
        dispatch(registerSuccess(data));
      }

    
      if (!data || !data.token) {
        throw new Error("No token received from server");
      }
      
      
      console.log(`${isLogin ? 'Login' : 'Registration'} successful!`);
      
   
      
    } catch (err) {
      console.error("Auth error:", err);
      let errorMessage = "An unexpected error occurred";
 
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setLogin(!isLogin);
    setError("");
    setFormData({ username: "", email: "", password: "" });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="w-96 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* Error Display */}
        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm relative">
            {error}
            <button 
              onClick={() => setError("")} 
              className="absolute top-1 right-2 text-lg font-bold hover:text-gray-300"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
              required
              disabled={loading}
              minLength="2"
              maxLength="50"
            />
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
            required
            disabled={loading}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Enter password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
            required
            disabled={loading}
            minLength="6"
          />
          
          <button
            type="submit"
            disabled={loading}
            className={`p-2 rounded text-white font-semibold transition-colors ${
              loading 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading 
              ? (isLogin ? "Logging in..." : "Registering...") 
              : (isLogin ? "Login" : "Register")
            }
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-indigo-500 hover:underline font-medium"
            onClick={toggleAuthMode}
            disabled={loading}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;