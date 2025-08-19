import { createSlice } from "@reduxjs/toolkit";

      const todoSlice = createSlice({
    name: 'todo',
    initialState: { 
        todos: [] 
    },
    reducers: {

    setTodo: (state, action) => {

            state.todos = action.payload;
        },


        addTodo: (state, action) => {
            state.todos.unshift(action.payload); 
        },

    updateTodo: (state, action) => {
            state.todos = state.todos.map((task) => 
                task._id === action.payload._id ? action.payload : task 
            );
        },

     deleteTodo: (state, action) => {
            state.todos = state.todos.filter((task) => task._id !== action.payload);
        }
      }
});

export const { setTodo, addTodo, updateTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;