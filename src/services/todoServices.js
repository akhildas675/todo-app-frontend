import axios from "axios";

const API_URL = "http://localhost:4000/todos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  // console.log("Token from localStorage:", token); 
  
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

export const getTodoTask = async () => {
  try {
    const res = await axios.get(API_URL, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Get todos error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Failed to fetch todos");
  }
};


export const addTodoTask = async (todoData) => {
  try {
    console.log("Adding todo:", todoData); 
    
  
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


export const editTodoTask = async (id, todoData) => {
  try {
    if (!id) {
      throw new Error("Todo ID is required");
    }
    
    // console.log("Editing todo:", id, todoData);
    const res = await axios.put(`${API_URL}/${id}`, todoData, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Edit todo error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Failed to edit todo");
  }
};

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