import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(
                    `${originalRequest.baseURL}/auth/refresh-token`,
                    {
                        token: refreshToken,
                    }
                );
                const { accessToken } = response.data;

                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (error) {
                console.log(error);
            }
        }

        return Promise.reject(error);
    }
);
