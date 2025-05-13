<template>
  <div class="pricing-container">
    <TheHeaderSession />

    <h1 class="title">Asignar Precio a Vehículo</h1>

    <!-- ✅ Mostrar el dropdown solo si vehicleOptions ya se llenó -->
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

    <!-- ✅ Mostrar solo si hay un vehículo seleccionado -->
    <div v-if="selectedVehicle" class="vehicle-info-container">
      <div class="vehicle-card">
        <h2 class="text-xl font-semibold mb-2">Datos del Vehículo</h2>
        <p><strong>Marca:</strong> {{ selectedVehicle.brandName }}</p>
        <p><strong>Modelo:</strong> {{ selectedVehicle.modelName }}</p>
        <p><strong>Equipaje (kg):</strong> {{ selectedVehicle.luggage_capacity }}</p>
        <p><strong>Pasajeros:</strong> {{ selectedVehicle.passengers }}</p>
        <p><strong>Disponible:</strong> {{ selectedVehicle.available }}</p>
      </div>

      <div class="form-card">
        <div class="form-group">
          <label class="block mb-2 font-medium">Precio por día </label>
          <InputText v-model="price" type="number" class="w-full" />
        </div>
        <Button label="Guardar Precio" class="w-full" @click="savePricing" />
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

import { VehicleApiService } from '@/shared/services/vehicle-api.service.js';
import { PricingApiService } from '@/shared/services/pricing-api.service.js';
import { BrandApiService } from '@/shared/services/brand-api.service.js';
import { ModelApiService } from '@/shared/services/model-api.service.js';

import TheHeaderSession from '@/components/elements/the-header-session.component.vue';
import TheFooter from "@/components/elements/the-footer.component.vue";

const route = useRoute();
const vehicle_id = ref(null); // ✅ ahora no se asigna directamente
const selectedVehicle = ref(null);
const price = ref('');
const vehicles = ref([]);
const vehicleOptions = ref([]);
const brands = ref([]);
const models = ref([]);

const vehicleApi = new VehicleApiService();
const pricingApi = new PricingApiService();
const brandApi = new BrandApiService();
const modelApi = new ModelApiService();

const fetchBrandsAndModels = async () => {
  const [brandsResponse, modelsResponse] = await Promise.all([
    brandApi.getAll(),
    modelApi.getAll()
  ]);
  brands.value = brandsResponse.data;
  models.value = modelsResponse.data;
};

const fetchVehicles = async () => {
  await fetchBrandsAndModels();

  const response = await vehicleApi.getAll();
  vehicles.value = response.data;

  vehicleOptions.value = vehicles.value.map(v => {
    const brand = brands.value.find(b => b.id === v.brand_id);
    const model = models.value.find(m => m.id === v.model_id);

    return {
      id: v.id,
      label: `${brand?.brand_name ?? 'Desconocida'} ${model?.car_model ?? 'Desconocido'}`,
      value: v.id
    };
  });

  // ✅ después de tener los vehículos, aplicamos la selección desde la ruta
  const idFromRoute = parseInt(route.params.vehicle_id);
  if (!isNaN(idFromRoute)) {
    vehicle_id.value = idFromRoute;
    loadSelectedVehicle(idFromRoute);
  }
};

const loadSelectedVehicle = (id) => {
  const v = vehicles.value.find(v => v.id === id);
  if (!v) return;

  const brand = brands.value.find(b => b.id === v.brand_id);
  const model = models.value.find(m => m.id === v.model_id);

  selectedVehicle.value = {
    ...v,
    brandName: brand?.brand_name ?? 'Desconocida',
    modelName: model?.car_model ?? 'Desconocido'
  };
};

const onVehicleChange = () => {
  if (vehicle_id.value) {
    loadSelectedVehicle(vehicle_id.value);
  } else {
    selectedVehicle.value = null;
  }
};

const savePricing = async () => {
  if (!selectedVehicle.value) return;

  const pricing = {
    vehicle_id: selectedVehicle.value.id,
    price: parseFloat(price.value),
  };

  try {
    await pricingApi.create(pricing);
    alert('✅ Precio asignado correctamente');
  } catch (error) {
    alert('❌ Error al asignar precio');
    console.error(error);
  }
};

onMounted(fetchVehicles);

// ✅ detectar si la ruta cambia mientras estás en la página
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
  padding: 120px 40px 80px;
  max-width: 1000px;
  margin: auto;
  text-align: center;
  position: fixed;
  bottom: 200px;
  left: 0;
  right: 0;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.vehicle-dropdown {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 30px;
}

.vehicle-info-container {
  display: flex;
  justify-content: space-around;
  gap: 30px;
  flex-wrap: wrap;
  animation: fadeIn 0.5s ease-in-out;
}

.vehicle-card,
.form-card {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  animation: fadeUp 0.4s ease-in-out;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

footer {
  background-color: #4f4d4d;
  padding: 10px 0;
  font-size: 15px;
  line-height: 24px;
  color: #737373;
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
