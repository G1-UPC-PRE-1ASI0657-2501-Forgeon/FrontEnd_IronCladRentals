<template>
  <div class="vehicle-details">
    <header>
      <TheHeaderSession />
    </header>

    <div class="content">
      <div v-if="loading" class="loading-message">
        Cargando vehículo...
      </div>

      <div v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-else class="details-card">
        <img v-if="vehicle.imageUrl" :src="vehicle.imageUrl" alt="Imagen del vehículo" class="vehicle-img" />

        <h1 class="vehicle-title">
          <span class="brand">{{ vehicle.brandName }}</span>
          <span class="divider">-</span>
          <span class="model">{{ vehicle.modelName }}</span>
        </h1>

        <div class="attributes">
          <div class="attr">
            <span class="icon">🚗</span>
            <span class="label">Pasajeros:</span>
            <span class="value">{{ vehicle.passengers }}</span>
          </div>
          <div class="attr">
            <span class="icon">🧳</span>
            <span class="label">Equipaje:</span>
            <span class="value">{{ vehicle.luggageCapacity }}</span>
          </div>
          <div class="attr">
            <span class="icon">✔️</span>
            <span class="label">Disponible:</span>
            <span class="value" :class="vehicle.available ? 'yes' : 'no'">
              {{ vehicle.available ? 'Sí' : 'No' }}
            </span>
          </div>
        </div>

        <p class="vehicle-info" v-if="vehicle.description">
          <span class="label">Descripción:</span>
          <span class="value">{{ vehicle.description }}</span>
        </p>
        <p class="vehicle-info" v-if="vehicle.freeText">
          <span class="label">Texto adicional:</span>
          <span class="value">{{ vehicle.freeText }}</span>
        </p>

        <div class="vehicle-price">
          <span class="icon">💵</span>
          <span class="label">Precio:</span>
          <span class="value">
            {{ vehicle.pricing?.dailyRate ? `S/ ${vehicle.pricing.dailyRate}` : 'No disponible' }}
          </span>
        </div>

        <button class="p-button-secondary" @click="$router.push('/arrendatario/search-vehicles')">
          Volver
        </button>
        <router-link :to="`/rent/${vehicle.vehicleId}`">
          <button class="p-button-secondary">Rentar este vehículo</button>
        </router-link>
      </div>
    </div>

    <footer>
      <TheFooter />
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import vehicleService from "@/shared/services/vehicle-api.service.js";

export default {
  name: "VehicleDetails",
  components: {
    TheHeaderSession,
    TheFooter,
  },
  setup() {
    const route = useRoute();
    const vehicle = ref(null);
    const loading = ref(true);
    const errorMessage = ref("");

   const API_BASE_URL = "http://localhost:5162";

const fetchVehicleDetails = async () => {
  try {
    const idParam = route.params.id;
    const vehicleId = parseInt(idParam, 10);
    if (isNaN(vehicleId)) {
      throw new Error(`ID inválido en la ruta: ${idParam}`);
    }

    console.log('Obteniendo detalles para ID:', vehicleId);
    const res = await vehicleService.getById(vehicleId);
    console.log('Respuesta del endpoint:', res);

    let v = res; // o res.data si tu servicio lo devuelve así

    // Corrige la URL de la imagen
    if (v.imageUrl && v.imageUrl.startsWith("/")) {
      v.imageUrl = API_BASE_URL + v.imageUrl;
    }

    vehicle.value = v;

    if (!vehicle.value || !vehicle.value.vehicleId) {
      throw new Error("No se encontró información del vehículo.");
    }
  } catch (error) {
    console.error("❌ Error al obtener los detalles del vehículo:", error);
    errorMessage.value = "Error cargando los datos del vehículo. Intenta más tarde.";
  } finally {
    loading.value = false;
  }
};

    onMounted(fetchVehicleDetails);

    return {
      vehicle,
      loading,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.vehicle-details {
  background: #f0f8f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  padding-bottom: 50px;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

footer {
  background-color: #4f4d4d;
  padding: 10px 0;
  font-size: 14px;
  color: #737373;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.content {
  position: fixed;
  top: 60px;
  bottom: 100px;
  left: 0;
  right: 0;
  padding: 25px 20px;
  overflow-y: auto;
  background: linear-gradient(135deg, #e6f0e6 0%, #c9dbc9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.loading-message,
.error-message {
  margin-top: 40px;
  font-size: 1.2rem;
  color: #2e7d32;
  text-align: center;
}

.error-message {
  color: #c62828;
}

.details-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
  padding: 32px 24px;
  max-width: 560px;
  width: 100%;
  text-align: center;
}

.vehicle-img {
  width: 100%;
  max-width: 320px;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
  background: #f2f2f2;
}

.vehicle-title {
  font-size: 1.8rem;
  color: #2e7d32;
  margin-bottom: 16px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.brand,
.model {
  color: #2e7d32;
}
.divider {
  color: #81c784;
}

.attributes {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.attr {
  background: #eef7ee;
  border-radius: 8px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  color: #2e7d32;
  font-weight: 500;
}
.attr .icon {
  font-size: 1.2rem;
}
.attr .yes {
  color: #1b5e20;
}
.attr .no {
  color: #c62828;
}

.vehicle-info {
  font-size: 1rem;
  color: #333;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  gap: 6px;
}
.vehicle-info .label {
  font-weight: 600;
  color: #4caf50;
}
.vehicle-info .value {
  font-weight: 500;
  color: #424242;
}

.vehicle-price {
  font-size: 1.2rem;
  color: #2e7d32;
  font-weight: 600;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: #eef7ee;
  border-radius: 8px;
}

.p-button-secondary {
  margin-top: 24px;
  background-color: #43a047;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}
.p-button-secondary:hover {
  background-color: #2e7d32;
  transform: scale(1.05);
}
</style>
