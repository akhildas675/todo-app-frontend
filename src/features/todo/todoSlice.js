import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
    name: 'todo',
    initialState: { 
        todos: [],
        dashboardData: {
            assignedByMe: [],
            assignedToMe: []
        },
        loading: false,
        error: null
    },
    reducers: {
        
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

  
        setError: (state, action) => {
            state.error = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },

        // todo operations
        setTodo: (state, action) => {
            state.todos = action.payload;
            state.error = null;
        },

        addTodo: (state, action) => {
            state.todos.unshift(action.payload);
            state.error = null;
        },

        updateTodo: (state, action) => {
            state.todos = state.todos.map((task) => 
                task._id === action.payload._id ? action.payload : task 
            );
            state.error = null;
        },

        deleteTodo: (state, action) => {
            state.todos = state.todos.filter((task) => task._id !== action.payload);
            state.error = null;
        },

        setDashboardData: (state, action) => {
            state.dashboardData = action.payload;
            state.error = null;
        },

        updateDashboardTask: (state, action) => {
            const updatedTask = action.payload;
            
            
            state.dashboardData.assignedByMe = state.dashboardData.assignedByMe.map(task =>
                task._id === updatedTask._id ? updatedTask : task
            );
            
          
            state.dashboardData.assignedToMe = state.dashboardData.assignedToMe.map(task =>
                task._id === updatedTask._id ? updatedTask : task
            );
            
            state.error = null;
        },

    
        clearTodoData: (state) => {
            state.todos = [];
            state.dashboardData = {
                assignedByMe: [],
                assignedToMe: []
            };
            state.loading = false;
            state.error = null;
        },

        
        markMultipleCompleted: (state, action) => {
            const taskIds = action.payload;
            state.todos = state.todos.map(task =>
                taskIds.includes(task._id) 
                    ? { ...task, status: 'completed' }
                    : task
            );
        },

        markMultiplePending: (state, action) => {
            const taskIds = action.payload;
            state.todos = state.todos.map(task =>
                taskIds.includes(task._id) 
                    ? { ...task, status: 'pending' }
                    : task
            );
        }
    }
});

export const { 
    setLoading,
    setError,
    clearError,
    setTodo, 
    addTodo, 
    updateTodo, 
    deleteTodo,
    setDashboardData,
    updateDashboardTask,
    clearTodoData,
    markMultipleCompleted,
    markMultiplePending
} = todoSlice.actions;

export default todoSlice.reducer;