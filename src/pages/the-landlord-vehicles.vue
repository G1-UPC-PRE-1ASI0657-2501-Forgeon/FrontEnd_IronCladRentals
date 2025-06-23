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
import vehicleService from "@/shared/services/vehicle-api.service.js"; // ✅ USO DIRECTO
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

    const brandApiService = new BrandApiService();
    const modelApiService = new ModelApiService();
    const priceApiService = new PricingApiService();

    const fetchAll = async () => {
      try {
        const [v, b, m, p] = await Promise.all([
          vehicleService.getAll(), // ✅ Uso correcto del nuevo servicio
          brandApiService.getAll(),
          modelApiService.getAll(),
          priceApiService.getAll()
        ]);
        vehicles.value = v;
        brands.value = b.data;
        models.value = m.data;
        prices.value = p.data;
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      }
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

        await vehicleService.create({
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
        console.error('❌ Error al agregar vehículo:', error);
      }
    };

    const deleteVehicle = async (vehicle) => {
      try {
        await vehicleService.delete(vehicle.id);
        await fetchAll();
      } catch (error) {
        console.error('❌ Error eliminando vehículo:', error);
      }
    };

    const toggleAvailability = async (vehicle) => {
      try {
        await vehicleService.update(vehicle.id, {
          ...vehicle,
          available: !vehicle.available
        });
        await fetchAll();
      } catch (error) {
        console.error('❌ Error actualizando disponibilidad:', error);
      }
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
