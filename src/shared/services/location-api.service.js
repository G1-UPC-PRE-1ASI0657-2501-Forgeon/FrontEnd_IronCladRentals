import api from "@/api/api.js";
import axios from "axios";

const http = axios.create({
    baseURL:'http://localhost:3000'
})

export class locationApiService {
    async getAll() {
        return await http.get('locations')
    }

    async getById(id) {
        return await http.get(`locations/`+id)
    }

    async create(body) {
        return await http.post('locations', body)
    }

    async update(id, body) {
        return await http.put(`locations/`+id, body)
    }

    async delete(id) {
        return await http.delete(`locations/`+id)
    }
}

export default new locationApiService;
