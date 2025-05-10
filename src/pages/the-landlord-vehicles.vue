<template>
  <div class="landlord-vehicles">
    <header>
      <TheHeaderSession />
    </header>
    <div class="content">

      <h1 class="page-title">Mis Vehículos</h1>

      <div class="add-vehicle-container">
        <Button :label="$t('addVehicle')" class="p-button-success add-vehicle-button" @click="showAddVehicleDialog = true" aria-label="Add Vehicle Button" />
      </div>

      <div class="cards-container">
        <div v-for="(vehicle, index) in vehicles" :key="vehicle.id" class="card1">
          <div class="p-4 border-round surface-card shadow-2 card-content" :aria-label="'Vehicle Card for ' + getModelName(vehicle.model_id)">
            <div class="flex flex-column align-items-center">
              <Tag :value="vehicle.available ? $t('available') : $t('unavailable')"
                   :severity="vehicle.available ? 'success' : 'danger'"
                   class="mb-3"
                   :aria-label="'Status: ' + (vehicle.available ? 'Available' : 'Unavailable')">
              </Tag>
              <h2 class="vehicle-title">{{ getBrandName(vehicle.brand_id) }} - {{ getModelName(vehicle.model_id) }}</h2>
              <p class="vehicle-info">{{ $t('passengers') }}: {{ vehicle.passengers }}</p>
              <p class="vehicle-info">{{ $t('luggage') }}: {{ vehicle.luggage_capacity }}</p>
              <p class="vehicle-info" v-if="vehicle.description">{{ $t('description') }}: {{ vehicle.description }}</p>
              <p class="vehicle-info" v-if="vehicle.free_text">{{ $t('freeText') }}: {{ vehicle.free_text }}</p>
              <div class="button-group mt-2">
                <Button :label="vehicle.available ? $t('Mark as Unavailable') : $t('Mark as Available')"
                        @click="toggleAvailability(vehicle)"
                        class="p-button-warning mr-2" />
                <Button :label="$t('delete')"
                        @click="deleteVehicle(vehicle)"
                        class="p-button-danger" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog header="Agregar Vehículo" v-model:visible="showAddVehicleDialog" :closable="true" :modal="true">
        <div class="dialog-content">
          <InputText v-model="newVehicle.brand_name" placeholder="Marca" class="w-full mb-2" />
          <InputText v-model="newVehicle.model_name" placeholder="Modelo" class="w-full mb-2" />
          <InputNumber v-model="newVehicle.passengers" :placeholder="$t('passengers')" class="w-full mb-2" />
          <InputNumber v-model="newVehicle.luggage_capacity" :placeholder="$t('luggage')" class="w-full mb-2" />
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
    const vehicles = ref([]);
    const brands = ref([]);
    const models = ref([]);
    const showAddVehicleDialog = ref(false);
    const newVehicle = ref({
      brand_name: '',
      model_name: '',
      passengers: 0,
      luggage_capacity: 0,
      available: true,
      description: '',
      free_text: ''
    });

    const vehicleApiService = new VehicleApiService();
    const brandApiService = new BrandApiService();
    const modelApiService = new ModelApiService();

    const fetchAll = async () => {
      const [v, b, m] = await Promise.all([
        vehicleApiService.getAll(),
        brandApiService.getAll(),
        modelApiService.getAll()
      ]);
      vehicles.value = v.data;
      brands.value = b.data;
      models.value = m.data;
    };

    const getBrandName = (id) => {
      const brand = brands.value.find(b => b.id === id);
      return brand ? brand.brand_name : 'Desconocido';
    };

    const getModelName = (id) => {
      const model = models.value.find(m => m.id === id);
      return model ? model.car_model : 'Desconocido';
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

        const companyId = localStorage.getItem('companyId'); // Obtener el companyId desde localStorage

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
          free_text: newVehicle.value.free_text,
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
      getModelName
    };
  }
};
</script>

<style scoped>
/* Título "Mis Vehículos" */
.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #1a493f;
  font-weight: bold;
  position: fixed;
  top: 8%; /* Ubicado debajo del header */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  margin: 0;
}

/* Botón "Agregar Vehículo" */
.add-vehicle-container {
  position: fixed;
  top: 20%; /* Ubicado debajo del título */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  margin-top: 20px;
  z-index: 2;
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

/* Contenedor de las tarjetas */
.cards-container {
  position: fixed;
  top: 32%; /* Ubicado debajo del botón de agregar vehículo */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  z-index: 1;
}

/* Card individual */
.card1 {
  width: 300px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card1:hover {
  transform: translateY(-5px);
}

.card-content {
  padding: 20px;
}

.vehicle-title {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
}

.vehicle-info {
  font-size: 1rem;
  color: #555;
  margin: 8px 0;
  text-align: center;
}

/* Footer */
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

/* Contenedor principal para centrar todo el contenido */
.content {
  position: relative;
  z-index: 0; /* Para que todo quede por debajo de los elementos con position fixed */
  padding-bottom: 100px; /* Ajuste para dejar espacio para el footer */
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

</style>
