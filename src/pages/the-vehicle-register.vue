<template>
  <div class="page-container">
    <div class="vehicle-form-container">
      <div class="form-card">

        <!-- Volver -->
        <div class="form-header">
          <button class="back-btn" @click="$router.back()">← Volver</button>
          <h2>🚗 Registrar Vehículo</h2>
        </div>

        <form @submit.prevent="submitVehicle">
          <!-- Información general -->
          <h3>📌 Información general</h3>

          <div class="form-row">
        <div class="form-group">
  <label>Marca</label>
  <select v-model.number="vehicle.brandId" @change="clearModel" required>
    <option :value="null" disabled>Selecciona una marca</option>
    <option
      v-for="brand in validBrands"
      :key="brand.id"
      :value="brand.id"
    >
      {{ brand.brandName }}
    </option>
  </select>
</div>

<div class="form-group">
  <label>Modelo</label>
  <select v-model.number="vehicle.modelId" :disabled="!vehicle.brandId" required>
    <option :value="null" disabled>Selecciona un modelo</option>
    <option
      v-for="model in validFilteredModels"
      :key="model.id"
      :value="model.id"
    >
      {{ model.carModel }}
    </option>
  </select>
</div>

          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Año</label>
              <input
                type="number"
                v-model.number="vehicle.year"
                placeholder="Ej: 2020"
                min="1900"
                max="2100"
                required
              />
            </div>
            <div class="form-group">
              <label>Color</label>
              <input type="text" v-model.trim="vehicle.color" required />
            </div>
            <div class="form-group">
              <label>Placa</label>
              <input type="text" v-model.trim="vehicle.licensePlate" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Pasajeros</label>
              <input type="number" v-model.number="vehicle.passengers" min="1" required />
            </div>
            <div class="form-group">
              <label>Capacidad Maletero (litros)</label>
              <input type="number" v-model.number="vehicle.luggageCapacity" min="0" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Transmisión</label>
              <input type="text" v-model.trim="vehicle.transmission" required />
            </div>
            <div class="form-group">
              <label>Combustible</label>
              <input type="text" v-model.trim="vehicle.fuelType" required />
            </div>
          </div>

        
          <!-- Precios -->
          <h3>💰 Precios</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Tarifa diaria ($)</label>
              <input type="number" v-model.number="vehicle.pricingDailyRate" min="0" required />
            </div>
            <div class="form-group">
              <label>Tarifa semanal ($)</label>
              <input type="number" v-model.number="vehicle.pricingWeeklyRate" min="0" />
            </div>
            <div class="form-group">
              <label>Descuento (%)</label>
              <input type="number" v-model.number="vehicle.pricingDiscount" min="0" max="100" />
            </div>
          </div>

          <!-- Imagen -->
          <h3>📷 Imagen del Vehículo</h3>
          <div class="form-group">
            <input type="file" @change="handleImage" accept="image/*" required />
          </div>

          <!-- Botón -->
          <button type="submit" :disabled="loading">
            {{ loading ? "Registrando..." : "Registrar Vehículo" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import vehicleService from '@/shared/services/vehicle-api.service';

export default {
  name: 'RegisterVehicle',
  data() {
    return {
      vehicle: {
        brandId: null,
        modelId: null,
        year: '',
        color: '',
        licensePlate: '',
        passengers: 1,
        luggageCapacity: 0,
        transmission: '',
        fuelType: '',
        pricingDailyRate: 0,
        pricingWeeklyRate: 0,
        pricingDiscount: 0
      },
      brands: [],
      models: [],
      selectedImage: null,
      loading: false
    };
  },
  computed: {
    validBrands() {
      return this.brands
        .filter(b => b && b.id != null && b.brandName);
    },
      validFilteredModels() {
    const selectedBrandId = Number(this.vehicle.brandId);
    if (!selectedBrandId) return [];
    return this.models
      .filter(m => m && m.id != null && m.brandId === selectedBrandId && m.carModel);
  }
  },
  async mounted() {
    try {
      const fetchedBrands = await vehicleService.getAllBrands();
      const fetchedModels = await vehicleService.getAllModels();

      this.brands = (fetchedBrands || []).map(b => ({
        ...b,
        id: Number(b.id)
      })).filter(b => b.id && b.brandName);

      this.models = (fetchedModels || []).map(m => ({
        ...m,
        id: Number(m.id),
        brandId: Number(m.brandId)
      })).filter(m => m.id && m.brandId && m.carModel);
      
    } catch (error) {
      console.error('❌ Error cargando marcas o modelos:', error);
      alert('Error al cargar datos. Intenta más tarde.');
    }
  },
  methods: {
    handleImage(event) {
      this.selectedImage = event.target.files[0];
    },
    clearModel() {
      this.vehicle.modelId = null;
    },
   async submitVehicle() {
  if (!this.vehicle.brandId || !this.vehicle.modelId) {
    alert('Por favor selecciona marca y modelo válidos.');
    return;
  }

  this.loading = true;
  try {
    const formData = new FormData();

    // Ajusta nombres según espera tu API
    formData.append('BrandId', this.vehicle.brandId);
    formData.append('ModelId', this.vehicle.modelId);
    formData.append('Year', this.vehicle.year);
    formData.append('Color', this.vehicle.color);
    formData.append('LicensePlate', this.vehicle.licensePlate);
    formData.append('Passengers', this.vehicle.passengers);
    formData.append('LuggageCapacity', this.vehicle.luggageCapacity);
    formData.append('Transmission', this.vehicle.transmission);
    formData.append('FuelType', this.vehicle.fuelType);
    formData.append('Pricing.DailyRate', this.vehicle.pricingDailyRate);
    formData.append('Pricing.WeeklyRate', this.vehicle.pricingWeeklyRate);
    formData.append('Pricing.Discount', this.vehicle.pricingDiscount);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    console.log('📦 Payload a enviar:');
    for (let [k, v] of formData.entries()) {
      console.log(`${k}:`, v);
    }

    await vehicleService.create(formData);
    alert('✅ Vehículo registrado con éxito.');
    this.$router.push('/landlord-vehicles');

  } catch (error) {
    console.error('❌ Error al registrar vehículo:', error);
    alert('Hubo un error al registrar el vehículo. Revisa los datos.');
  } finally {
    this.loading = false;
  }
}

  }
};
</script>

<style scoped>
/* mismo estilo de antes con tu header, back-btn y demás */
.page-container {
  background: linear-gradient(to bottom, #e9f5f3 0%, #f6f9f9 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.vehicle-form-container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.form-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  width: 100%;
}

.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.back-btn {
  background-color: #145c4f;
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #0f443b;
}

.form-header h2 {
  color: #1a4a3f;
  margin: 0;
  font-size: 26px;
}

h3 {
  color: #145c4f;
  border-bottom: 2px solid #d4e9e2;
  padding-bottom: 6px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 20px;
  display: flex;
  align-items: center;
}

h3::before {
  content: '•';
  color: #1a4a3f;
  font-weight: bold;
  margin-right: 8px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  border-color: #75aa9c;
  outline: none;
}

button[type="submit"] {
  margin-top: 30px;
  background-color: #1a4a3f;
  color: white;
  font-weight: bold;
  padding: 14px;
  border: none;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #145c4f;
}

button[type="submit"]:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .form-card {
    padding: 30px 20px;
  }

  h3 {
    font-size: 18px;
  }

  input, select, button {
    font-size: 14px;
  }
}
</style>
