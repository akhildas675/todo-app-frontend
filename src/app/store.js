import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';4
import todoReducer from '../features/todo/todoSlice'



const store = configureStore({
    reducer:{
        auth:authReducer,
        todos:todoReducer,
    }
})

export default store