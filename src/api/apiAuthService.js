import axios from "axios";
import userService from "@/shared/services/user-api.service.js";

const api = axios.create({
    baseURL: "http://localhost:5056/ironclead/v1",
    withCredentials: true, // si usas cookies HttpOnly
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Interceptor solo para el microservicio de autenticación
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/authentication/sign-in")
        ) {
            originalRequest._retry = true;

            try {
                // solo si tienes implementación de refreshToken
                await userService.refreshToken();
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Error al refrescar el token:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
