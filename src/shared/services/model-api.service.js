import axios from "axios";

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

export class ModelApiService {
    async getAll() {
        return await http.get('models');
    }

    async getById(id) {
        return await http.get(`models/${id}`);
    }

    async create(body) {
        return await http.post('models', body);
    }

    async update(id, body) {
        return await http.put(`models/${id}`, body);
    }

    async delete(id) {
        return await http.delete(`models/${id}`);
    }
}

export default new ModelApiService();