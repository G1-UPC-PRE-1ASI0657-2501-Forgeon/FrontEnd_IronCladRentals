<template>
  <div class="pricing-container">

    <h1 class="title">Asignar Precio a Vehículo</h1>

    <Dropdown
      v-if="vehicleOptions.length"
      v-model="vehicle_id"
      :options="vehicleOptions"
      optionLabel="label"
      optionValue="id"
      placeholder="Selecciona un vehículo"
      class="vehicle-dropdown"
      @change="onVehicleChange"
    />

    <div v-if="selectedVehicle" class="vehicle-info-container">
      <div class="vehicle-card">
        <h2 class="subtitle">Datos del Vehículo</h2>
        <p><strong>Marca:</strong> {{ selectedVehicle.brandName }}</p>
        <p><strong>Modelo:</strong> {{ selectedVehicle.modelName }}</p>
        <p><strong>Equipaje (kg):</strong> {{ selectedVehicle.luggageCapacity }}</p>
        <p><strong>Pasajeros:</strong> {{ selectedVehicle.passengers }}</p>
        <p><strong>Disponible:</strong> {{ selectedVehicle.available ? 'Sí' : 'No' }}</p>
        <img
          v-if="selectedVehicle.imageUrl"
          :src="selectedVehicle.imageUrl"
          alt="Imagen del vehículo"
          class="vehicle-image mb-3"
        />
      </div>

      <div class="form-card">
        <div class="form-group">
          <label class="form-label">Precio por día</label>
          <InputText v-model="price" type="number" class="form-input" />
        </div>
        <Button label="Guardar Precio" class="save-button" @click="savePricing" />
      </div>
    </div>
  </div>

  <footer>
    <TheFooter />
  </footer>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import vehicleService from '@/shared/services/vehicle-api.service.js';
import pricingService from '@/shared/services/pricing-api.service.js';

import TheHeaderSession from '@/components/elements/the-header-session.component.vue';
import TheFooter from "@/components/elements/the-footer.component.vue";

const route = useRoute();
const vehicle_id = ref(null);
const selectedVehicle = ref(null);
const price = ref('');
const vehicles = ref([]);
const vehicleOptions = ref([]);

const fetchVehicles = async () => {
  try {
    const vehicleList = await vehicleService.getAvailable();
    vehicles.value = vehicleList;

    vehicleOptions.value = vehicleList.map(v => ({
      id: v.id,
      label: `${v.brandName} ${v.modelName}`,
    }));

    const idFromRoute = parseInt(route.params.vehicle_id);
    if (!isNaN(idFromRoute)) {
      vehicle_id.value = idFromRoute;
      loadSelectedVehicle(idFromRoute);
    }
  } catch (error) {
    console.error("❌ Error cargando vehículos:", error);
  }
};

const loadSelectedVehicle = (id) => {
  const v = vehicles.value.find(v => v.id === id);
  selectedVehicle.value = v || null;
};

const onVehicleChange = () => {
  loadSelectedVehicle(vehicle_id.value);
};

const savePricing = async () => {
  if (!selectedVehicle.value || isNaN(parseFloat(price.value))) {
    alert("Por favor selecciona un vehículo y un precio válido.");
    return;
  }

  try {
    await pricingService.create({
      vehicle_id: selectedVehicle.value.id,
      price: parseFloat(price.value),
    });
    alert('✅ Precio asignado correctamente');
  } catch (error) {
    console.error('❌ Error al asignar precio:', error);
    alert('❌ Error al asignar precio');
  }
};

onMounted(fetchVehicles);

watch(
  () => route.params.vehicle_id,
  (newId) => {
    const id = parseInt(newId);
    if (!isNaN(id) && vehicles.value.length > 0) {
      vehicle_id.value = id;
      loadSelectedVehicle(id);
    }
  }
);
</script>

<style scoped>
.pricing-container {
  padding: 120px 20px 100px;
  max-width: 100%;
  margin: auto;
  text-align: center;
  background: linear-gradient(to bottom right, #a3d1b1, #a4ffaf);
  min-height: 100vh;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1b4332;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d6a4f;
}

.vehicle-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.vehicle-dropdown {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 30px;
}

.vehicle-info-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  animation: fadeIn 0.5s ease-in-out;
}

.vehicle-card,
.form-card {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  padding: 25px;
  border-radius: 20px;
  background: linear-gradient(90deg, #eaffda, #ffffff);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  animation: fadeUp 0.4s ease-in-out;
  transition: transform 0.3s;
}

.vehicle-card:hover,
.form-card:hover {
  transform: translateY(-5px);
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1b4332;
}

.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.save-button {
  width: 100%;
  background-color: #2d6a4f;
  border: none;
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #1b4332;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

footer {
  background-color: #1b4332;
  padding: 10px 0;
  font-size: 15px;
  line-height: 24px;
  color: #d8f3dc;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
