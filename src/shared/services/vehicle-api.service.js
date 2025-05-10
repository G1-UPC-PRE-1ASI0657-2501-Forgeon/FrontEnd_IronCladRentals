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

    async update(id, body) {
        return await http.put(`vehicles/`+id, body)
    }

    async delete(id) {
        return await http.delete(`vehicles/`+id)
    }
}

export default new VehicleApiService();