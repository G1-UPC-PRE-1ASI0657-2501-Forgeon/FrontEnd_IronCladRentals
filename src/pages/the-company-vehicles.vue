<template>
  <div class="company-vehicles">
    <TheHeaderSession />

    <main class="content">
      <h1 class="page-title">Mis Vehículos</h1>

      <div v-if="loading" class="loading">Cargando vehículos...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="vehicles.length === 0" class="empty-message">
        <p>No tienes vehículos registrados.</p>
        <button @click="goToAddVehicle" class="add-vehicle-btn">
          ➕ Registrar Primer Vehículo
        </button>
      </div>

      <div v-else class="vehicles-section">
        <div class="section-header">
          <h2 class="section-title">🚗 Mi Flota de Vehículos</h2>
          <button @click="goToAddVehicle" class="add-vehicle-btn">
            ➕ Agregar Vehículo
          </button>
        </div>
        
        <div class="vehicles-grid">
          <div v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card">
            <img :src="vehicle.imageUrl" alt="Imagen del vehículo" class="vehicle-img" />
            <div class="vehicle-content">
              <h3 class="vehicle-title">{{ vehicle.brandName }} {{ vehicle.modelName }}</h3>
              <div class="vehicle-details">
                <p class="detail-item">
                  <span class="icon">👥</span>
                  <span class="label">Pasajeros:</span>
                  <span class="value">{{ vehicle.passengers }}</span>
                </p>
                <p class="detail-item">
                  <span class="icon">🧳</span>
                  <span class="label">Equipaje:</span>
                  <span class="value">{{ vehicle.luggageCapacity }}</span>
                </p>
                <p class="detail-item">
                  <span class="icon">📍</span>
                  <span class="label">Estado:</span>
                  <span class="value" :class="vehicle.available ? 'available' : 'unavailable'">
                    {{ vehicle.available ? 'Disponible' : 'No disponible' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import vehicleService from "@/shared/services/vehicle-api.service.js";

const router = useRouter();
const vehicles = ref([]);
const loading = ref(true);
const error = ref("");

const fetchCompanyVehicles = async () => {
  try {
    loading.value = true;
    error.value = "";

    console.log("🔄 Obteniendo información de la compañía...");

    // 1️⃣ Obtener los datos de la compañía del usuario actual
    const company = await vehicleService.getCompanyMe();
    if (!company || !company.companyId) {
      error.value = "No tienes una compañía asociada.";
      console.log("❌ No hay compañía asociada");
      return;
    }

    const companyId = company.companyId;
    console.log("✅ Company obtenida:", company);

    // 2️⃣ Obtener vehículos de la compañía
    console.log("🔄 Obteniendo vehículos de la compañía...");
    const companyVehicles = await vehicleService.getByCompanyId(companyId);
    
    vehicles.value = companyVehicles;
    console.log("✅ Vehículos obtenidos:", companyVehicles);

  } catch (err) {
    console.error("❌ Error cargando vehículos:", err);
    error.value = "Error cargando los vehículos de tu compañía.";
  } finally {
    loading.value = false;
  }
};

const goToAddVehicle = () => {
  router.push('/vehicles/create');
};

onMounted(fetchCompanyVehicles);
</script>

<style scoped>
.content {
  position: fixed;
  top: 60px;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 20px;
  overflow-y: auto;
  background: linear-gradient(135deg, #e6f0e6 0%, #c9dbc9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 2.3rem;
  color: #3a5d3a;
  margin-bottom: 24px;
  text-align: center;
}

.loading,
.error,
.empty-message {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 20px;
  color: #4a764a;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.vehicles-section {
  width: 100%;
  max-width: 1200px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  color: #2e7d32;
  margin: 0;
}

.add-vehicle-btn {
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-vehicle-btn:hover {
  background: linear-gradient(135deg, #1b5e20, #0d4d14);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
}

.vehicle-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(127, 168, 127, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 2px solid transparent;
}

.vehicle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(127, 168, 127, 0.25);
  border-color: #2e7d32;
}

.vehicle-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.vehicle-content {
  padding: 20px;
}

.vehicle-title {
  font-size: 1.5rem;
  color: #2e7d32;
  margin: 0 0 16px 0;
  font-weight: 700;
  text-align: center;
}

.vehicle-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 1rem;
}

.icon {
  font-size: 1.2rem;
  margin-right: 8px;
  width: 20px;
}

.label {
  font-weight: 600;
  color: #4a764a;
  margin-right: 8px;
}

.value {
  color: #333;
}

.value.available {
  color: #2e7d32;
  font-weight: 600;
}

.value.unavailable {
  color: #d32f2f;
  font-weight: 600;
}

footer {
  background-color: #496b49;
  padding: 12px 0;
  font-size: 13px;
  color: #e0f2e0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  box-shadow: 0 -3px 8px rgba(53, 102, 53, 0.25);
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .vehicles-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .content {
    padding: 15px;
  }
}
</style>
