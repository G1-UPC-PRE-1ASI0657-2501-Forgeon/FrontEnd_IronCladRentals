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
        <input id="priceRange" type="range" min="50" :max="realMaxPrice" v-model="maxPrice" step="1" />

        </div>
      </div>

      <transition-group name="card" tag="div" class="cards-container">
        <div
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          class="card"
          @click="$router.push(`/vehicle/${vehicle.id}`)"
          role="button"
          tabindex="0"
          @keyup.enter="$router.push(`/vehicle/${vehicle.id}`)"
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
  const minPrice = ref(50);
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
  bottom: 100px;
  left: 0;
  right: 0;
  padding: 25px 20px;
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
  font-size: 2.8rem;
  color: #3a5d3a;
  margin-bottom: 30px;
  text-shadow: 1px 1px 3px rgba(58, 93, 58, 0.3);
}

.filters {
  display: flex;
  gap: 18px;
  justify-content: center;
  width: 100%;
  max-width: 1100px;
  margin-bottom: 30px;
}

.search-bar {
  flex: 1 1 280px;
  padding: 12px 18px;
  font-size: 1.1rem;
  border-radius: 12px;
  border: 2.5px solid #7fa87f;
  background-color: #f2faf2;
  color: #496b49;
  box-shadow: 0 4px 8px rgba(127, 168, 127, 0.15);
  transition: all 0.3s ease;
}

.search-bar::placeholder {
  color: #8ca88c;
  font-style: italic;
}

.search-bar:focus {
  outline: none;
  border-color: #4a764a;
  background-color: #d9efd9;
  box-shadow: 0 6px 12px rgba(74, 118, 74, 0.25);
  transform: scale(1.03);
}

.brand-filter {
  flex: 0 0 180px;
  padding: 12px 18px;
  font-size: 1.1rem;
  border-radius: 12px;
  border: 2.5px solid #7fa87f;
  background-color: #f2faf2;
  color: #496b49;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(127, 168, 127, 0.15);
}

.brand-filter:hover,
.brand-filter:focus {
  border-color: #4a764a;
  background-color: #d9efd9;
  box-shadow: 0 6px 12px rgba(74, 118, 74, 0.25);
  outline: none;
}

.price-filter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 180px;
  font-size: 1rem;
  color: #356635;
  font-weight: 600;
  gap: 4px;
}
.price-filter input[type="range"] {
  width: 140px;
  accent-color: #217a21;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 22px;
  width: 100%;
  max-width: 1100px;
  flex-grow: 1;
  padding-bottom: 10px;
}

.card {
  flex: 1 1 calc(25% - 22px);
  max-width: calc(25% - 22px);
  background: #ffffff;
  border-radius: 18px;
  box-shadow:
      0 10px 15px rgba(127, 168, 127, 0.2),
      0 3px 7px rgba(58, 93, 58, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 18px;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.card-enter-active,
.card-leave-active {
  transition: all 0.4s ease;
}

.card::before {
  content: "";
  position: absolute;
  top: -40%;
  right: -40%;
  width: 180%;
  height: 180%;
  background: #a6c9a6;
  transform: rotate(45deg);
  transition: transform 0.4s ease, opacity 0.4s ease;
  z-index: 0;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.4;
}

.card:hover::before {
  transform: rotate(45deg) translateX(-15%);
  opacity: 0.6;
}

.card:hover {
  transform: translateY(-7px);
  box-shadow:
      0 15px 25px rgba(127, 168, 127, 0.4),
      0 7px 15px rgba(58, 93, 58, 0.2);
  z-index: 10;
}

.card-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.vehicle-img {
  width: 100%;
  max-width: 220px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(127, 168, 127, 0.18);
  background: #f2faf2;
}

.vehicle-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.45rem;
  color: #356635;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(53, 102, 53, 0.25);
}

.vehicle-info {
  font-size: 1rem;
  color: #4f794f;
  margin: 6px 0;
  font-weight: 600;
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
  letter-spacing: 0.01em;
}

.vehicle-price {
  font-size: 1.15rem;
  color: #217a21;
  font-weight: 700;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.01em;
}

footer {
  background-color: #496b49;
  padding: 18px 0 16px 0;
  font-size: 14px;
  line-height: 22px;
  color: #e0f2e0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  box-shadow: 0 -4px 10px rgba(53, 102, 53, 0.3);
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
}

@media (max-width: 900px) {
  .card {
    flex: 1 1 calc(50% - 20px);
    max-width: calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .filters {
    flex-direction: column;
    gap: 15px;
  }

  .search-bar,
  .brand-filter {
    width: 100%;
    max-width: none;
  }

  .card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>