import api from "@/api/apiVehicleService.js";

export class BrandApiService {
  async getAll() {
    try {
      const response = await api.get("/brands");
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener las marcas:", error);
      throw error.response?.data || "Error de red o servidor";
    }
  }
}
