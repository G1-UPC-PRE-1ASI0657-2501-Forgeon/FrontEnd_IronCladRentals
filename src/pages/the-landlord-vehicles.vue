<template>
  <div class="landlord-vehicles">
    <header>
      <TheHeaderSession />
    </header>
    <div class="content">
      <h1 class="page-title">Mis Vehículos</h1>

      <div class="add-vehicle-container">
        <Button :label="$t('Añadir Vehiculo')" class="p-button-success add-vehicle-button" @click="showAddVehicleDialog = true" />
      </div>

      <transition-group name="fade" tag="div" class="cards-container">
        <div v-for="(vehicle, index) in vehicles" :key="vehicle.id" class="card1">
          <div class="p-4 border-round surface-card shadow-2 card-content">
            <div class="flex flex-column align-items-center">
              <!-- Imagen -->
              <img :src="vehicle.url" alt="Imagen del vehículo" class="vehicle-image mb-3" v-if="vehicle.url" />

              <!-- Tag de disponibilidad -->
              <Tag :value="vehicle.available ? $t('available') : $t('unavailable')"
                   :severity="vehicle.available ? 'success' : 'danger'"
                   class="mb-3" />
              <!-- Marca y modelo -->
              <h2 class="vehicle-title">{{ getBrandName(vehicle.brand_id) }} - {{ getModelName(vehicle.model_id) }}</h2>

              <!-- Info -->
              <p class="vehicle-info">{{ $t('Pasajeros') }}: {{ vehicle.passengers }}</p>
              <p class="vehicle-info">{{ $t('Equipaje (kg)') }}: {{ vehicle.luggage_capacity }}</p>

              <!-- Botones -->
              <div class="button-group mt-2">
                <Button :label="vehicle.available ? $t('Mark as Unavailable') : $t('Mark as Available')"
                        @click="toggleAvailability(vehicle)"
                        class="p-button-warning mr-2" />
                <Button :label="$t('delete')"
                        @click="deleteVehicle(vehicle)"
                        class="p-button-danger mr-2" />
                <Button
                    :label="hasPrice(vehicle.id) ? 'Editar datos' : 'Agregar precio'"
                    class="p-button-info"
                    @click="goToPricing(vehicle.id)" />
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Diálogo para agregar vehículo -->
      <Dialog header="Agregar Vehículo" v-model:visible="showAddVehicleDialog" :closable="true" :modal="true">
        <div class="dialog-content">
          <div class="form-group">
            <label>Marca:</label>
            <InputText v-model="newVehicle.brand_name" class="w-full mb-3" />
          </div>
          <div class="form-group">
            <label>Modelo:</label>
            <InputText v-model="newVehicle.model_name" class="w-full mb-3" />
          </div>
          <div class="form-group">
            <label>{{ $t('Pasajeros') }}:</label>
            <InputNumber v-model="newVehicle.passengers" class="w-full mb-3" />
          </div>
          <div class="form-group">
            <label>{{ $t('Equipaje (kg)') }}:</label>
            <InputNumber v-model="newVehicle.luggage_capacity" class="w-full mb-3" />
          </div>
          <div class="form-group">
            <label>Imagen (URL):</label>
            <InputText v-model="newVehicle.url" class="w-full mb-3" placeholder="https://..." />
          </div>
          <Button :label="$t('add')" @click="handleAddVehicle" class="p-button-success mt-2 w-full" />
        </div>
      </Dialog>
    </div>
    <footer>
      <TheFooter />
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import { VehicleApiService } from "@/shared/services/vehicle-api.service.js";
import { BrandApiService } from "@/shared/services/brand-api.service.js";
import { ModelApiService } from "@/shared/services/model-api.service.js";
import { PricingApiService } from '@/shared/services/pricing-api.service.js';

export default {
  name: 'LandlordVehicles',
  components: {
    Tag,
    Button,
    Dialog,
    InputNumber,
    InputText,
    TheHeaderSession,
    TheFooter
  },
  setup() {
    const router = useRouter();
    const vehicles = ref([]);
    const brands = ref([]);
    const models = ref([]);
    const prices = ref([]);
    const showAddVehicleDialog = ref(false);
    const newVehicle = ref({
      brand_name: '',
      model_name: '',
      passengers: 0,
      luggage_capacity: 0,
      available: true,
      url: ''
    });

    const vehicleApiService = new VehicleApiService();
    const brandApiService = new BrandApiService();
    const modelApiService = new ModelApiService();
    const priceApiService = new PricingApiService();

    const fetchAll = async () => {
      const [v, b, m, p] = await Promise.all([
        vehicleApiService.getAll(),
        brandApiService.getAll(),
        modelApiService.getAll(),
        priceApiService.getAll()
      ]);
      vehicles.value = v.data;
      brands.value = b.data;
      models.value = m.data;
      prices.value = p.data;
    };

    const getBrandName = (id) => {
      const brand = brands.value.find(b => b.id === id);
      return brand ? brand.brand_name : 'Desconocido';
    };

    const getModelName = (id) => {
      const model = models.value.find(m => m.id === id);
      return model ? model.car_model : 'Desconocido';
    };

    const hasPrice = (vehicleId) => {
      return prices.value.some(p => p.vehicle_id === vehicleId);
    };

    const goToPricing = (vehicleId) => {
      router.push(`/landlord/vehicles/pricing/${vehicleId}`);
    };

    const findOrCreateBrand = async (name) => {
      let brand = brands.value.find(b => b.brand_name.toLowerCase() === name.toLowerCase());
      if (!brand) {
        const response = await brandApiService.create({ brand_name: name });
        brand = response.data;
        brands.value.push(brand);
      }
      return brand.id;
    };

    const findOrCreateModel = async (name, brand_id) => {
      let model = models.value.find(m => m.car_model.toLowerCase() === name.toLowerCase() && m.brand_id === brand_id);
      if (!model) {
        const response = await modelApiService.create({ car_model: name, brand_id });
        model = response.data;
        models.value.push(model);
      }
      return model.id;
    };

    const handleAddVehicle = async () => {
      try {
        const brand_id = await findOrCreateBrand(newVehicle.value.brand_name);
        const model_id = await findOrCreateModel(newVehicle.value.model_name, brand_id);
        const companyId = localStorage.getItem('companyId');

        if (!companyId) {
          console.error('No se encontró el ID de la compañía en el localStorage');
          return;
        }

        await vehicleApiService.create({
          brand_id,
          model_id,
          passengers: newVehicle.value.passengers,
          luggage_capacity: newVehicle.value.luggage_capacity,
          available: newVehicle.value.available,
          url: newVehicle.value.url,
          companyId: companyId
        });

        await fetchAll();
        showAddVehicleDialog.value = false;
      } catch (error) {
        console.error('Error al agregar vehículo:', error);
      }
    };

    const deleteVehicle = async (vehicle) => {
      try {
        await vehicleApiService.delete(vehicle.id);
        await fetchAll();
      } catch (error) {
        console.error('Error deleting vehicle', error);
      }
    };

    const toggleAvailability = async (vehicle) => {
      await vehicleApiService.update(vehicle.id, {
        ...vehicle,
        available: !vehicle.available
      });
      await fetchAll();
    };

    onMounted(fetchAll);

    return {
      vehicles,
      showAddVehicleDialog,
      newVehicle,
      handleAddVehicle,
      deleteVehicle,
      toggleAvailability,
      getBrandName,
      getModelName,
      hasPrice,
      goToPricing
    };
  }
};
</script>

<style scoped>
.landlord-vehicles {
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

footer {
  background-color: #2c3e50;
  padding: 12px 0;
  font-size: 14px;
  color: #e0e0e0;
  text-align: center;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #08351a;
  font-weight: bold;
  margin-bottom: 20px;
}

.add-vehicle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.add-vehicle-button {
  font-size: 1.2rem;
  padding: 12px 32px;
  border-radius: 30px;
  background-color: #28a745;
  color: white;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-vehicle-button:hover {
  background-color: #218838;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.card1 {
  width: 320px;
  background: linear-gradient(135deg, #d8f3dc, #ffffff);
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card1:hover {
  transform: scale(1.02);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 25px;
  text-align: center;
}

.vehicle-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.vehicle-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b4332;
  margin-bottom: 12px;
}

.vehicle-info {
  font-size: 1rem;
  color: #407148;
  margin: 6px 0;
}

.dialog-content .form-group {
  margin-bottom: 1rem;
}

.dialog-content label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
  color: #1d3a27;
}

header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 1100px) {
  .main-layout {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  .form-container, .locations-list {
    width: 100%;
    max-width: 100%;
  }
}
</style>
