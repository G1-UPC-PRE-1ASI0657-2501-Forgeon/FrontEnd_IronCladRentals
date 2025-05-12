<template>
  <div class="vehicle-details">
    <header>
      <TheHeaderSession />
    </header>
    <div class="content">
      <div class="details-card">
        <h1 class="vehicle-title">{{ brandName }} - {{ modelName }}</h1>
        <p class="vehicle-info"><strong>Pasajeros:</strong> {{ vehicle.passengers }}</p>
        <p class="vehicle-info"><strong>Equipaje:</strong> {{ vehicle.luggage_capacity }}</p>
        <p class="vehicle-info" v-if="vehicle.description"><strong>Descripción:</strong> {{ vehicle.description }}</p>
        <p class="vehicle-info" v-if="vehicle.free_text"><strong>Texto adicional:</strong> {{ vehicle.free_text }}</p>
        <Button label="Volver" class="p-button-secondary" @click="$router.push('/search-vehicles')" />
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

    const vehicleApiService = new VehicleApiService();
    const brandApiService = new BrandApiService();
    const modelApiService = new ModelApiService();

    const fetchVehicleDetails = async () => {
      try {
        const vehicleId = route.params.id;
        const v = await vehicleApiService.getById(vehicleId);
        vehicle.value = v.data;

        const brand = await brandApiService.getById(vehicle.value.brand_id);
        brandName.value = brand.data.brand_name;

        const model = await modelApiService.getById(vehicle.value.model_id);
        modelName.value = model.data.car_model;
      } catch (error) {
        console.error("Error al obtener los detalles del vehículo:", error);
      }
    };

    onMounted(fetchVehicleDetails);

    return {
      vehicle,
      brandName,
      modelName,
    };
  },
};
</script>

<style scoped>
.vehicle-details {
  position: fixed;
  top: 10%;
  left: 0;
  width: 100%;
  height: 90%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e9f5f3, #d4e9e2);
  animation: fadeIn 0.5s ease-in-out;
}

.details-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 50px;
  max-width: 750px;
  width: 95%;
  text-align: center;
  transform: scale(0.95);
  animation: popIn 0.5s ease-in-out;
}

.vehicle-title {
  font-size: 2.8rem;
  color: #1a493f;
  margin-bottom: 25px;
  font-weight: bold;
}

.vehicle-info {
  font-size: 1.5rem;
  color: #333;
  margin: 15px 0;
}

.p-button-secondary {
  margin-top: 30px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.p-button-secondary:hover {
  background-color: #45a049;
  transform: scale(1.1);
}

/* Footer */
footer {
  background-color: #4f4d4d;
  padding: 15px 0;
  font-size: 16px;
  line-height: 24px;
  color: #e0e0e0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* Contenedor principal */
.content {
  position: relative;
  z-index: 0;
  padding-bottom: 100px;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>