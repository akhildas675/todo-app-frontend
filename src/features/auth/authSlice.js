import { createSlice } from "@reduxjs/toolkit";


const getInitialState = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    return {
        user: userData ? JSON.parse(userData) : null,
        token: token,
        isAuthenticated: !!token
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            
           
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },

        registerSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});

export const { loginSuccess, registerSuccess, logout } = authSlice.actions;

export default authSlice.reducer;