import api from "@/api/apiRentalService.js";

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
            const response = await api.post("/rental", rentalData);
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
    },

     async getRentalsActiveMe() {
        try {
            const response = await api.get("/rental/me/active", {
                withCredentials: true,
                skipAuthInterceptor: true, // Bandera personalizada
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                return null; // Devuelve null si no está autenticado
            }
            console.error("❌ Error obteniendo usuario:", error);
            throw error; // Lanza otros errores
        }  
    },
     async getRentalsPendingMe() {
        try {
            const response = await api.get("/rental/me/pending", {
                withCredentials: true,
                skipAuthInterceptor: true, // Bandera personalizada
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                return null; // Devuelve null si no está autenticado
            }
            console.error("❌ Error obteniendo usuario:", error);
            throw error; // Lanza otros errores
        }  
    },

    // 🔹 OBTENER RENTAS PENDIENTES Y NO PAGADAS
    async getRentalsPendingUnpaidMe() {
        try {
            const response = await api.get("/rental/me/pending/unpaid", {
                withCredentials: true,
                skipAuthInterceptor: true,
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                return null;
            }
            console.error("❌ Error obteniendo rentas pendientes no pagadas:", error);
            throw error;
        }
    },

    // 🔹 OBTENER INFORMACIÓN DE VEHÍCULO PARA RENTA (con precio)
    async getRentalVehicleInformation(rentalId) {
        try {
            const response = await api.get(`/rental/rentalinformationvehicle/${rentalId}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo información del vehículo para renta:", error);
            throw error.response ? error.response.data : "Error de red o del servidor";
        }
    },
      // 🔹 OBTENER RENTAS POR VEHÍCULO
 async getByCompanyId(companyId) {
    try {
        const response = await api.get(`/rental/company/${companyId}/pending`);
        return response.data;
    } catch (error) {
        console.error("❌ Error obteniendo rentas por compañía:", error);
        throw error.response ? error.response.data : "Error de red o del servidor";
    }
},

};

export default rentalService;
