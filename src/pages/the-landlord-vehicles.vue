<template>
  <div class="dashboard-container">
    <div v-if="company">
      <h1>¡Bienvenido, {{ company.name }}!</h1>

      <section class="company-info">
        <h2>Tu Compañía</h2>
        <ul>
          <li><strong>Nombre:</strong> {{ company.name }}</li>
          <li><strong>RUC:</strong> {{ company.ruc }}</li>
          <li><strong>Estado:</strong> Activa</li>
          <li><strong>Registrada el:</strong> {{ formatDate(company.createdAt) }}</li>
        </ul>
      </section>

      <section class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <button @click="goToAddVehicle">➕ Registrar Vehículo</button>
          <button @click="goToVehicles">🗂️ Ver mis Vehículos</button>
          <button @click="goToReservations">📅 Ver Reservas</button>
          <button @click="goToPayments">💰 Pagos Pendientes</button>
          <button @click="goToEditCompany">✏️ Editar Compañía</button>
        </div>
      </section>

      <section v-if="summary" class="summary-card">
        <h2>📊 Resumen</h2>
        <ul>
          <li>Vehículos: {{ summary.vehicles }}</li>
          <li>Reservas activas: {{ summary.activeReservations }}</li>
          <li>Ingresos este mes: ${{ summary.monthlyIncome }}</li>
        </ul>
      </section>
    </div>

    <div v-else class="loading">
      <p>Cargando información de la compañía...</p>
    </div>
  </div>
</template>

<script>
import vehicleService from '@/shared/services/vehicle-api.service';

export default {
  name: 'CompanyDashboard',
  data() {
    return {
      company: null,
      summary: null
    };
  },
  async mounted() {
    try {
      this.company = await vehicleService.getCompanyMe();
      if (!this.company) {
        this.$router.push('/company-register');
      }

      // Opcional: podrías cargar aquí también un resumen
      // this.summary = await vehicleService.getCompanySummary(this.company.id);
    } catch (error) {
      console.error('❌ Error obteniendo la compañía:', error);
      // Opcional: redirigir o mostrar error amigable
      this.$router.push('/company-register');
    }
  },
  methods: {
    goToAddVehicle() {
      this.$router.push('/vehicles/create');
    },
      formatDate(dateStr) {
    if (!dateStr) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
  },
    goToVehicles() {
      this.$router.push('/vehicles');
    },
    goToReservations() {
      this.$router.push('/reservations');
    },
    goToPayments() {
      this.$router.push('/payments');
    },
    goToEditCompany() {
      this.$router.push('/company/edit');
    }
  }
};
</script>
<style>

body {
  background-color: #e9f5f3;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.dashboard-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.company-card, .summary-card, .actions-section {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.company-card h2,
.actions-section h2,
.summary-card h2 {
  margin-bottom: 12px;
  color: #1a4a3f;
  font-size: 20px;
  border-bottom: 2px solid #d4e9e2;
  padding-bottom: 6px;
}

.company-card ul,
.summary-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.company-card li,
.summary-card li {
  margin: 8px 0;
  font-size: 16px;
}

.actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.actions-grid button {
  flex: 1 1 40%;
  min-width: 140px;
  padding: 12px;
  background-color: #1a4a3f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.actions-grid button:hover {
  background-color: #145c4f;
}

@media (max-width: 600px) {
  .actions-grid {
    flex-direction: column;
  }

  .actions-grid button {
    flex: 1 1 100%;
  }
}
</style>