import axios from "axios";

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

export class PaymentMethodApiService {
    async getAll() {
        return await http.get('payment-methods');
    }

    async getById(id) {
        return await http.get(`payment-methods/${id}`);
    }

    async getByUserId(userId) {
        return await http.get(`payment-methods`, { params: { user_id: userId } });
    }

    async create(body) {
        return await http.post('payment-methods', body);
    }

    async update(id, body) {
        return await http.put(`payment-methods/${id}`, body);
    }

    async delete(id) {
        return await http.delete(`payment-methods/${id}`);
    }
}

export default new PaymentMethodApiService();