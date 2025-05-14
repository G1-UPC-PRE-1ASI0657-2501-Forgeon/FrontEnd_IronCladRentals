import axios from "axios";
import userService from "@/shared/services/user-api.service.js";

const api = axios.create({
    baseURL: "http://localhost:5162",
        withCredentials: true, // ✅ para que mande/reciba cookies
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});



// El interceptor se puede quitar si no gestionas tokens o credenciales
axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // El código de manejo de errores para refrescar tokens se puede quitar
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/authentication/sign-in')
        ) {
            originalRequest._retry = true;

            try {
                // Esta función ya no se usaría
                await userService.refreshToken();
                return axios(originalRequest);
            } catch (refreshError) {
                console.error("Error al refrescar el token:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
