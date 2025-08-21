import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import TodoTask from "../pages/TodoTask";
import Dashboard from "../pages/Dashboard";

//protect route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// public route
const PublicRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  if (isAuthenticated && token) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

// app route
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />

        <ProtectedRoute>
          <Route path="/home" element={<HomePage />} />

          <Route path="/assign" element={<TodoTask />} />

          <Route path="/dashboard" element={<Dashboard />} />
        </ProtectedRoute>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
