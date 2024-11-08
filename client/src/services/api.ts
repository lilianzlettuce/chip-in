import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:6969",
    withCredentials: true,
});

export const googleAuth = (code: string) => api.get(`/auth/google?code=${code}`);