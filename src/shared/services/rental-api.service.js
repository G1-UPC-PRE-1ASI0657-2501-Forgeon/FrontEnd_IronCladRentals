import api from "@/api/api.js";

const rentalService = {
    // 🔹 OBTENER TODAS LAS RENTAS
    async getAll() {
        try {
            const response = await api.get("/rentals");
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo todas las rentas:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 OBTENER RENTA POR ID
    async getById(id) {
        try {
            const response = await api.get(`/rentals/${id}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo renta por ID:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 CREAR UNA RENTA
    async create(rentalData) {
        try {
            const response = await api.post("/rentals", rentalData);
            return response.data;
        } catch (error) {
            console.error("❌ Error creando la renta:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 ACTUALIZAR UNA RENTA
    async update(id, rentalData) {
        try {
            const response = await api.put(`/rentals/${id}`, rentalData);
            return response.data;
        } catch (error) {
            console.error("❌ Error actualizando la renta:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 ELIMINAR UNA RENTA
    async delete(id) {
        try {
            await api.delete(`/rentals/${id}`);
            console.log("✅ Renta eliminada correctamente.");
        } catch (error) {
            console.error("❌ Error eliminando la renta:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 OBTENER RENTAS POR USUARIO
    async getByUserId(userId) {
        try {
            const response = await api.get(`/rentals?user_id=${userId}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo rentas por usuario:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },

    // 🔹 OBTENER RENTAS POR VEHÍCULO
    async getByVehicleId(vehicleId) {
        try {
            const response = await api.get(`/rentals?vehicle_id=${vehicleId}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo rentas por vehículo:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    }
};

export default rentalService;
