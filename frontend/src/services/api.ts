import axios from "axios";

declare global {
    interface Window {
        __ENV__?: {
            API_BASE_URL?: string;
        };
    }
}

const api = axios.create({
    baseURL: window.__ENV__?.API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("cloudvault_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("cloudvault_token");
            localStorage.removeItem("cloudvault_user");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;