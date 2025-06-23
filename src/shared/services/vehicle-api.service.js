import api from "@/api/apiVehicleService"; // Asegúrate de que este apunta a tu instancia de axios configurada
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5162";

const vehicleService = {
  // 🔹 OBTENER TODOS LOS VEHÍCULOS
  async getAll() {
    try {
      const response = await api.get("/vehicle");
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo todos los vehículos:", error);
      throw error.response ? error.response.data : "Error de red o del servidor";
    }
  },

  // 🔹 OBTENER VEHÍCULOS DISPONIBLES
async getAvailable() {
  try {
    const response = await api.get("/vehicle/available");
    const vehicles = response.data;

    // Arregla las URLs de imagen
    return vehicles.map(vehicle => ({
      ...vehicle,
      imageUrl: vehicle.imageUrl?.startsWith("http")
        ? vehicle.imageUrl
        : `${BASE_URL}${vehicle.imageUrl}`
    }));
  } catch (error) {
    console.error("❌ Error obteniendo vehículos disponibles:", error);
    throw error.response ? error.response.data : "Error de red o del servidor";
  }
},


  // 🔹 OBTENER VEHÍCULO POR ID
  async getById(id) {
    try {
      const response = await api.get(`/vehicle/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo vehículo por ID:", error);
      throw error.response ? error.response.data : "Error de red o del servidor";
    }
  },

  // 🔹 CREAR VEHÍCULO
  async create(vehicleData) {
    try {
      const response = await api.post("/vehicle", vehicleData);
      return response.data;
    } catch (error) {
      console.error("❌ Error creando vehículo:", error);
      throw error.response ? error.response.data : "Error de red o del servidor";
    }
  },

  // 🔹 ACTUALIZAR VEHÍCULO
  async update(id, vehicleData) {
    try {
      const response = await api.put(`/vehicle/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      console.error("❌ Error actualizando vehículo:", error);
      throw error.response ? error.response.data : "Error de red o del servidor";
    }
  },

  // 🔹 ELIMINAR VEHÍCULO
  async delete(id) {
    try {
      await api.delete(`/vehicle/${id}`);
      console.log("✅ Vehículo eliminado correctamente.");
    } catch (error) {
      console.error("❌ Error eliminando vehículo:", error);
      throw error.response ? error.response.data : "Error de red o del servidor";
    }
  }
};

export default vehicleService;
