import axios from 'axios'

const SERVER_API = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: SERVER_API,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

export default api
