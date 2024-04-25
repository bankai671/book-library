import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    accessToken: null,
    isAuth: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        registerStart: (state) => {
            state.isLoading = true;
        },
        registerSuccess: (state, action) => {
            const { accessToken, refreshToken } = action.payload;
            state.isLoading = false;
            state.isAuth = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },
        registerFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        loginStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            const { accessToken, refreshToken } = action.payload;
            state.isLoading = false;
            state.isAuth = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.isAuth = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
});

export const {
    registerStart,
    registerSuccess,
    registerFailure,
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
