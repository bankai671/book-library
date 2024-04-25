import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { loginSuccess } from './store';
import { router } from './router';

import './index.css';

export const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const user = JSON.parse(localStorage.getItem('user'));
            dispatch(loginSuccess({ accessToken, refreshToken, user }));
        }
    }, []);

    return <RouterProvider router={router} />;
};
