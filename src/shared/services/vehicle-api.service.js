import axios from "axios";

const http = axios.create({
    baseURL:'http://localhost:3000'
})
export class VehicleApiService {
    async getAll() {
        return await http.get('vehicles')
    }

    async getById(id) {
        return await http.get(`vehicles/`+id)
    }

    async create(body) {
        return await http.post('vehicles', body)
    }

     async createCompany(credentials) {
        try {
            const response = await api.post("/ironclead/v1/authentication/sign-in", credentials,{ withCredentials: true });
            return response;  // 🔥 RETORNAR la respuesta completa
        } catch (error) {
            console.error("❌ Error en loginUser:", error);
            throw error;  // 🔥 Re-lanzar el error para que lo capture `handleLogin`
        }
    }


    async update(id, body) {
        return await http.put(`vehicles/`+id, body)
    }

    async delete(id) {
        return await http.delete(`vehicles/`+id)
    }
}

export default new VehicleApiService();