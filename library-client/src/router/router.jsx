import { createBrowserRouter } from 'react-router-dom';

import { Book, Dashboard, Favourites, Home, Login, NotFond, ReadBook, Register } from '../pages';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/favourites',
        element: <Favourites />,
    },
    {
        path: '/book/:id',
        element: <Book />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/read-book',
        element: <ReadBook />,
    },
    {
        path: '*',
        element: <NotFond />,
    },
]);
