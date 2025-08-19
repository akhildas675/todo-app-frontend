import axios from "axios";

const API_URL = "http://localhost:4000/todos";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token); // Debug log
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }
  
  return { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } 
  };
};

// Get all todos
export const getTodoTask = async () => {
  try {
    const res = await axios.get(API_URL, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Get todos error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Failed to fetch todos");
  }
};

// Add a new todo
export const addTodoTask = async (todoData) => {
  try {
    console.log("Adding todo:", todoData); // Debug log
    
    // Validate data before sending
    if (!todoData.task || todoData.task.trim() === "") {
      throw new Error("Task is required");
    }
    
    const res = await axios.post(API_URL, todoData, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Add todo error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Failed to add todo");
  }
};

// Edit a todo
export const editTodoTask = async (id, todoData) => {
  try {
    if (!id) {
      throw new Error("Todo ID is required");
    }
    
    console.log("Editing todo:", id, todoData); // Debug log
    const res = await axios.put(`${API_URL}/${id}`, todoData, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Edit todo error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Failed to edit todo");
  }
};

// Delete a todo
export const deleteTodoTask = async (id) => {
  try {
    if (!id) {
      throw new Error("Todo ID is required");
    }
    
    console.log("Deleting todo:", id); 
    const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Delete todo error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Failed to delete todo");
  }
};