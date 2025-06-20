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

        <h2 class="subtitle">Datos del Vehículo</h2>
        <p><strong>Marca:</strong> {{ selectedVehicle.brandName }}</p>
        <p><strong>Modelo:</strong> {{ selectedVehicle.modelName }}</p>
        <p><strong>Equipaje (kg):</strong> {{ selectedVehicle.luggage_capacity }}</p>
        <p><strong>Pasajeros:</strong> {{ selectedVehicle.passengers }}</p>
        <p><strong>Disponible:</strong> {{ selectedVehicle.available }}</p>
        <img :src="selectedVehicle.url" alt="Imagen del vehículo" class="vehicle-image mb-3" v-if="selectedVehicle.url" />

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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #a3d1b1, #a4ffaf);
}

.content {
  flex: 1; /* Permite que el contenido crezca y empuje el footer hacia abajo */
  margin: 0 auto;
  padding: 40px 20px;
  max-width: 1200px;
  width: 100%;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1b4332;
  text-align: center;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d6a4f;
  text-align: center;
}

.vehicle-dropdown {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 30px;
}

.vehicle-info-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.vehicle-card,
.form-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  padding: 25px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  background: linear-gradient(90deg, #eaffda, #ffffff);
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

.vehicle-image {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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

footer {
  background-color: #1b4332;
  padding: 10px 0;
  font-size: 15px;
  line-height: 24px;
  color: #d8f3dc;
  text-align: center;
}
</style>
