<template>
  <div class="search-vehicles">
    <header>
      <TheHeaderSession />
    </header>
    <main class="content">
      <h1 class="page-title">Buscar Vehículos</h1>
      <div class="filters">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar por modelo"
          class="search-bar"
          aria-label="Buscar por modelo"
        />
        <select v-model="selectedBrand" class="brand-filter" aria-label="Filtrar por marca">
          <option value="">Todas las marcas</option>
          <option v-for="brand in brandOptions" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
        <div class="price-filter">
          <label for="priceRange">Precio máx: S/ {{ maxPrice }}</label>
        <input id="priceRange" type="range" min="1" :max="realMaxPrice" v-model="maxPrice" step="1" />

        </div>
      </div>

      <transition-group name="card" tag="div" class="cards-container">
        <div
          v-for="vehicle in filteredVehicles"
          :key="vehicle.vehicleId"
          class="card"
          @click="$router.push(`/vehicle/${vehicle.vehicleId}`)"
          role="button"
          tabindex="0"
          @keyup.enter="$router.push(`/vehicle/${vehicle.vehicleId}`)"
        >
          <div class="card-content">
            <img :src="vehicle.imageUrl" alt="Imagen del vehículo" class="vehicle-img" />
            <h2 class="vehicle-title">
              {{ vehicle.brandName }} - {{ vehicle.modelName }}
            </h2>
            <p class="vehicle-info"><span>🚗 Pasajeros:</span> {{ vehicle.passengers }}</p>
            <p class="vehicle-info"><span>🧳 Equipaje:</span> {{ vehicle.luggageCapacity }}</p>
            <p class="vehicle-price">
              <span>💵 Precio:</span>
              {{ vehicle.pricing?.dailyRate ? `S/ ${vehicle.pricing.dailyRate}` : 'No disponible' }}
            </p>
          </div>
        </div>
      </transition-group>
    </main>
    <footer>
      <TheFooter />
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import TheHeaderSession from '@/components/elements/the-header-session.component.vue';
import TheFooter from '@/components/elements/the-footer.component.vue';
import vehicleService from '@/shared/services/vehicle-api.service.js';

export default {
  name: 'SearchVehicles',
  components: { TheHeaderSession, TheFooter },
setup() {
  const vehicles = ref([]);
  const searchQuery = ref('');
  const selectedBrand = ref('');
  const minPrice = ref(1);
  const maxPrice = ref(1000);
  const realMaxPrice = ref(1000);

const fetchVehicles = async () => {
  try {
    const data = await vehicleService.getAvailable();
    if (Array.isArray(data)) {
      vehicles.value = data;

      const prices = data.map(v => v?.pricing?.dailyRate).filter(p => typeof p === 'number');
      const max = prices.length ? Math.max(...prices) : 1000;

      realMaxPrice.value = max;
      maxPrice.value = max; // valor inicial del slider
    }
  } catch (error) {
    console.error('❌ Error cargando los datos:', error);
    vehicles.value = [];
  }
};


  const brandOptions = computed(() => {
    const brands = new Set(vehicles.value.map(v => v.brandName).filter(Boolean));
    return [...brands];
  });

  const filteredVehicles = computed(() => {
    return vehicles.value.filter(vehicle => {
      const matchesBrand = !selectedBrand.value || vehicle.brandName === selectedBrand.value;
      const matchesSearch =
        !searchQuery.value ||
        (vehicle.modelName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false);
      const price = vehicle.pricing?.dailyRate ?? null;
      const matchesPrice =
        price !== null && price >= minPrice.value && price <= maxPrice.value;
      return matchesBrand && matchesSearch && matchesPrice;
    });
  });

  onMounted(fetchVehicles);

  return {
    vehicles,
    searchQuery,
    selectedBrand,
    filteredVehicles,
    minPrice,
    maxPrice,
    realMaxPrice,
    brandOptions,
  };
}
,
};
</script>



<style scoped>
.content {
  position: fixed;
  top: 60px;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 20px;
  overflow-y: auto;
  background: linear-gradient(135deg, #e6f0e6 0%, #c9dbc9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
  color: #3a5d3a;
  margin-bottom: 24px;
  text-align: center;
}

.filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1100px;
  margin-bottom: 20px;
}

.search-bar,
.brand-filter {
  padding: 10px 16px;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid #7fa87f;
  background-color: #f2faf2;
  color: #496b49;
  transition: all 0.3s ease;
  flex: 1 1 220px;
  max-width: 280px;
  box-shadow: 0 2px 4px rgba(127, 168, 127, 0.1);
}

.search-bar::placeholder {
  color: #8ca88c;
  font-style: italic;
}

.search-bar:focus,
.brand-filter:focus {
  outline: none;
  border-color: #4a764a;
  background-color: #d9efd9;
  box-shadow: 0 4px 8px rgba(74, 118, 74, 0.2);
}

.price-filter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.95rem;
  color: #356635;
  font-weight: 600;
  gap: 4px;
  min-width: 160px;
}

.price-filter input[type="range"] {
  width: 150px;
  accent-color: #217a21;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1100px;
}

.card {
  flex: 1 1 220px;
  max-width: 260px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(127, 168, 127, 0.15);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: 16px;
  user-select: none;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(127, 168, 127, 0.25);
}

.card-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vehicle-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 12px;
  background-color: #f2faf2;
  box-shadow: 0 2px 6px rgba(127, 168, 127, 0.12);
}

.vehicle-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: #356635;
  margin-bottom: 8px;
}

.vehicle-info {
  font-size: 0.95rem;
  color: #4f794f;
  margin: 4px 0;
  font-weight: 600;
}

.vehicle-price {
  font-size: 1.05rem;
  color: #217a21;
  font-weight: 700;
  margin-top: 8px;
}

footer {
  background-color: #496b49;
  padding: 12px 0;
  font-size: 13px;
  color: #e0f2e0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  box-shadow: 0 -3px 8px rgba(53, 102, 53, 0.25);
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

@media (max-width: 900px) {
  .card {
    flex: 1 1 45%;
    max-width: 45%;
  }
}

@media (max-width: 600px) {
  .filters {
    flex-direction: column;
    align-items: center;
  }

  .search-bar,
  .brand-filter,
  .price-filter {
    width: 100%;
    max-width: 300px;
  }

  .card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

</style>