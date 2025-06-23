import api from "@/api/apiVehicleService.js";

export class ModelApiService {
  async getAll() {
    try {
      const response = await api.get("/models");
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener los modelos:", error);
      throw error.response?.data || "Error de red o servidor";
    }
  }
}
