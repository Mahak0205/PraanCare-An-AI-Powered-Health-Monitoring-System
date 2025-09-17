import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/auth'
});

export const googleAuth = (code) =>api.post('/google', {code});
export const manualAuth = (credentials) => api.post('/manual', credentials);
export const signupUser = (data)=>api.post('/signup', data);

