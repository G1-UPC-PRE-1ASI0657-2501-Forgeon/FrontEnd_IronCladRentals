import axios from "axios";

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

export class PricingApiService {
    async getAll() {
        return await http.get('pricings');
    }

    async getById(id) {
        return await http.get(`pricings/${id}`);
    }

    async create(body) {
        return await http.post('pricings', body);
    }

    async update(id, body) {
        return await http.put(`pricings/${id}`, body);
    }

    async delete(id) {
        return await http.delete(`pricings/${id}`);
    }
}

export default new PricingApiService();
