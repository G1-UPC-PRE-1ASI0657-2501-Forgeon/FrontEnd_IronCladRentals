<template>
  <div class="company-form-container">
    <div class="form-card">
      <div class="form-header">
        <span class="form-icon">🏢</span>
        <h2>Registrar tu Compañía</h2>
        <p class="form-subtitle">
          Para continuar como arrendador, necesitamos los datos de tu compañía.
        </p>
      </div>
      <form @submit.prevent="submitCompany">
        <div class="form-group">
          <label for="name">Nombre de la Compañía</label>
          <input v-model="company.name" type="text" id="name" placeholder="Arrendamientos López S.A." required />
        </div>

        <div class="form-group">
          <label for="ruc">RUC</label>
          <input v-model="company.ruc" type="text" id="ruc" placeholder="1234567890" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Registrando..." : "Registrar Compañía" }}
        </button>
      </form>
    </div>
  </div>
</template>


<script>
import { v4 as uuidv4 } from 'uuid';
import userService from '@/shared/services/user-api.service';
import vehicleService from '@/shared/services/vehicle-api.service';
export default {
  name: 'The-Create-Company',
  data() {
  return {
    company: {
      name: '',
      ruc: ''
    },
    loading: false
  };
},
methods: {
  async submitCompany() {
    const userId = await userService.getInfoUser();
    if (!userId) {
      alert('No se ha encontrado un usuario logueado.');
      return;
    }

    this.loading = true;

    const newCompany = {
      ...this.company,
    };

    try {
     await vehicleService.createCompany(newCompany); 

      alert('¡Compañía registrada con éxito!');
      this.$router.push('/home');
    } catch (error) {
      console.error('Error al crear la compañía:', error);
      alert('Hubo un error al registrar la compañía. Intenta de nuevo.');
    } finally {
      this.loading = false;
    }
  }
}

};
</script>

<style scoped>
.company-form-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e9f5f3, #d4e9e2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
  z-index: 10;
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
  width: 100%;
  max-width: 420px;
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-header {
  text-align: center;
  margin-bottom: 20px;
}

.form-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}


label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #444;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #75aa9c;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #1a4a3f;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #145c4f;
}

/* Responsive */
@media (max-width: 480px) {
  .form-card {
    padding: 30px 20px;
  }

  h2 {
    font-size: 20px;
  }

  input,
  button {
    font-size: 14px;
  }
}
</style>
