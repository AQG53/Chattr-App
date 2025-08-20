import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api" || `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true, //send cookies with request
})