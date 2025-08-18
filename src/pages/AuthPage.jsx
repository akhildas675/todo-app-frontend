import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, registerSuccess } from "../features/auth/authSlice";
import { loginUser, registerUser } from "../services/api"

const AuthPage = () => {
  const [isLogin, setLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        dispatch(loginSuccess(data));
      } else {
        const data = await registerUser(formData);
        dispatch(registerSuccess(data));
      }
    } catch (err) {
      console.error("Auth error:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="w-96 bg-gray-900 p-6 rounded-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Enter name"
              value={formData.username}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 border border-gray-600"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 border border-gray-600"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded text-white font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "you don’t have an account?" : "already have an account?"}{" "}
          <button
            className="text-indigo-500 hover:underline"
            onClick={() => setLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
