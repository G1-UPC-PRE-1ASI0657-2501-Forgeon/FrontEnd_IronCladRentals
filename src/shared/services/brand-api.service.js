import axios from "axios";

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

export class BrandApiService {
    async getAll() {
        return await http.get('brands');
    }

    async getById(id) {
        return await http.get(`brands/${id}`);
    }

    async create(body) {
        return await http.post('brands', body);
    }

    async update(id, body) {
        return await http.put(`brands/${id}`, body);
    }

    async delete(id) {
        return await http.delete(`brands/${id}`);
    }
}

export default new BrandApiService();