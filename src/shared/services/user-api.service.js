import axios from 'axios';

const http = axios.create({
    baseURL:'http://localhost:3000/'
})
export class UserApiService {
    async getAll() {
        return await http.get('/users')
    }
    async getById(id) {
        return await http.get('users/'+id)
    }
    async create(body) {
        return await http.post('users',body)
    }
    async update(body,id) {
        return await http.put('users/'+id,body)
    }
    async delete(id) {
        return await http.delete('users/'+id)
    }
    async getPayments_pendingById(id) {
        return await http.get('users/payments_pending'+id)
    }
    async login(username, password) {
        try {
            const response = await http.get('/users');
            const users = response.data;

            const user = users.find(user => user.name === username);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            if (user.password === password) {
                return user;
            } else {
                throw new Error('Contraseña incorrecta');
            }
        } catch (error) {
            throw error;
        }
    }

}

