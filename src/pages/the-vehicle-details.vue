<template>
  <div class="vehicle-details">
    <header>
      <TheHeaderSession />
    </header>

    <div class="content">
      <div class="details-card">
        <img v-if="vehicle.url" :src="vehicle.url" alt="Imagen del vehículo" class="vehicle-img" />
        <h1 class="vehicle-title">
          <span class="brand">{{ brandName }}</span>
          <span class="divider">-</span>
          <span class="model">{{ modelName }}</span>
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
            <span class="value">{{ vehicle.luggage_capacity }}</span>
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
        <p class="vehicle-info" v-if="vehicle.free_text">
          <span class="label">Texto adicional:</span>
          <span class="value">{{ vehicle.free_text }}</span>
        </p>

        <div class="vehicle-price">
          <span class="icon">💵</span>
          <span class="label">Precio:</span>
          <span class="value">{{ price }}</span>
        </div>

        <Button label="Volver" class="p-button-secondary" @click="$router.push('/search-vehicles')">Regresar</button>

        <router-link :to="`/rent/${vehicle.id}`">
          <button class="p-button-secondary">
            Rentar este vehículo
          </button>
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
import { VehicleApiService } from "@/shared/services/vehicle-api.service.js";
import { BrandApiService } from "@/shared/services/brand-api.service.js";
import { ModelApiService } from "@/shared/services/model-api.service.js";
import { PricingApiService } from "@/shared/services/pricing-api.service.js";

export default {
  name: "VehicleDetails",
  components: {
    TheHeaderSession,
    TheFooter,
  },
  setup() {
    const route = useRoute();
    const vehicle = ref({});
    const brandName = ref("");
    const modelName = ref("");
    const price = ref("No disponible");

    const vehicleApiService = new VehicleApiService();
    const brandApiService = new BrandApiService();
    const modelApiService = new ModelApiService();
    const pricingApiService = new PricingApiService();

    const fetchVehicleDetails = async () => {
      try {
        const vehicleId = route.params.id;
        const v = await vehicleApiService.getById(vehicleId);
        vehicle.value = v.data;

        const brand = await brandApiService.getById(vehicle.value.brand_id);
        brandName.value = brand.data.brand_name;

        const model = await modelApiService.getById(vehicle.value.model_id);
        modelName.value = model.data.car_model;

        const pricings = await pricingApiService.getAll();
        const pricing = pricings.data.find(p => p.vehicle_id === vehicleId);
        price.value = pricing ? `S/ ${pricing.price}` : "No disponible";
      } catch (error) {
        console.error("Error al obtener los detalles del vehículo:", error);
      }
    };

    onMounted(fetchVehicleDetails);

    return {
      vehicle,
      brandName,
      modelName,
      price,
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
}

/* Header con sticky */
header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Footer normal (no fixed) */
footer {
  background-color: #2c3e50;
  padding: 10px 0;
  font-size: 14px;
  color: #737373;
  text-align: center;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
}

/* Contenedor de contenido crece dinámicamente */
.content {
  flex: 1;
  padding: 25px 20px;
  background: linear-gradient(135deg, #e6f0e6 0%, #c9dbc9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
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
  border: none;
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

