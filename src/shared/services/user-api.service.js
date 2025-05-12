import api from "@/api/api.js";

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
            const response = await api.post("/users", userData);
            return response.data;
        } catch (error) {
            console.error("❌ Error creando usuario:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
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
