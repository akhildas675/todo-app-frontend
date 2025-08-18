import { createSlice } from "@reduxjs/toolkit";



const todoSlice = createSlice({
    name:'todo',
    initialState:{todos:[]},
    reducers:{
       setTodo:(state,action)=>{
        state.todo=action.payload
       },

       addTodo:(state,action)=>{
        state.todo.push(action.payload)
       },

       updateTodo:(state,action)=>{
        state.todo=state.todo.map((task)=>{
            task._id===action.payload._id ? action.payload : task
        })
       },

       deleteTodo:(state,action)=>{
        state.todo=state.todo.filter((task)=>task._id!==action.payload)
       }
    }
})

export const {setTodo,addTodo,updateTodo,deleteTodo}=todoSlice.actions;

export default todoSlice.reducer