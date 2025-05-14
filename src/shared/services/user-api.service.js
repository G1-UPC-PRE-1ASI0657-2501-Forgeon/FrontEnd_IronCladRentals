import api from "@/api/apiAuthService.js";

const userService = {
    // 🔹 OBTENER TODOS LOS USUARIOS
    async getAll() {
        try {
            const response = await api.get("/users");
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo todos los usuarios:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 OBTENER USUARIO POR ID
    async getById(id) {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo usuario por ID:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 CREAR USUARIO
    async create(userData) {
        try {
            const response = await api.post("/ironclead/v1/authentication/sign-up", userData);
            return response.data;
        } catch (error) {
            console.error("❌ Error creando usuario:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

     async loginUser(credentials) {
        try {
            const response = await api.post("/ironclead/v1/authentication/sign-in", credentials,{ withCredentials: true });
            return response;  // 🔥 RETORNAR la respuesta completa
        } catch (error) {
            console.error("❌ Error en loginUser:", error);
            throw error;  // 🔥 Re-lanzar el error para que lo capture `handleLogin`
        }
    },

  // 🔹 OBTENER INFORMACIÓN DEL USUARIO (USA HttpOnly COOKIES)
    async getInfoUser() {
        try {
            console.log("🔍 Haciendo petición a /auth-user/me...");
            const response = await api.get("ironclead/v1/AuthUser/me", {
                withCredentials: true,
                skipAuthInterceptor: true, // Bandera personalizada
            });
            console.log("✅ Usuario obtenido correctamente:", response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn("⚠️ Usuario no autenticado o token expirado.");
                return null; // Devuelve null si no está autenticado
            }
            console.error("❌ Error obteniendo usuario:", error);
            throw error; // Lanza otros errores
        }
    },

    // 🔹 ACTUALIZAR USUARIO
    async update(id, userData) {
        try {
            const response = await api.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error("❌ Error actualizando usuario:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 ELIMINAR USUARIO
    async delete(id) {
        try {
            await api.delete(`/users/${id}`);
            console.log("✅ Usuario eliminado correctamente.");
        } catch (error) {
            console.error("❌ Error eliminando usuario:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 OBTENER PAGOS PENDIENTES POR ID
    async getPaymentsPendingById(id) {
        try {
            const response = await api.get(`/users/payments_pending/${id}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo pagos pendientes:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 LOGIN DE USUARIO
    async login(username, password) {
        try {
            const response = await api.post("/authentication/sign-in", { username, password });
            return response.data;
        } catch (error) {
            console.error("❌ Error en login:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    }
};

export default userService;
