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
          <option v-for="brand in uniqueBrands" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
        <div class="price-filter">
          <label for="priceRange">Precio máx: S/ {{ maxPrice }}</label>
          <input
            id="priceRange"
            type="range"
            min="50"
            :max="realMaxPrice"
            v-model="maxPrice"
            step="10"
          />
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
            <img :src="vehicle.url" alt="Imagen del vehículo" class="vehicle-img" />
            <h2 class="vehicle-title">
              {{ vehicle.brandName }} - {{ vehicle.modelName }}
            </h2>
            <p class="vehicle-info"><span>🚗 Pasajeros:</span> {{ vehicle.passengers }}</p>
            <p class="vehicle-info"><span>🧳 Equipaje:</span> {{ vehicle.luggage_capacity }}</p>
            <p class="vehicle-price"><span>💵 Precio:</span> {{ formatPrice(vehicle.price) }}</p>
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
import { ref, computed, onMounted } from "vue";
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import vehicleService from "@/shared/services/vehicle-api.service.js";

export default {
  name: "SearchVehicles",
  components: {
    TheHeaderSession,
    TheFooter,
  },
  setup() {
    const vehicles = ref([]);
    const searchQuery = ref("");
    const selectedBrand = ref("");
    const minPrice = ref(50);
    const maxPrice = ref(1000);

    const fetchAvailableVehicles = async () => {
      try {
        const response = await vehicleService.getAvailable();
        vehicles.value = response.map(v => ({
          ...v,
          price: parseFloat(v.price)
        }));
        maxPrice.value = realMaxPrice.value;
      } catch (error) {
        console.error("❌ Error cargando vehículos:", error);
      }
    };

    const uniqueBrands = computed(() => {
      const allBrands = vehicles.value.map(v => v.brandName);
      return [...new Set(allBrands)].sort();
    });

    const realMaxPrice = computed(() => {
      if (!vehicles.value.length) return 1000;
      return Math.max(...vehicles.value.map(v => v.price || 0));
    });

    const filteredVehicles = computed(() => {
      return vehicles.value.filter((v) => {
        const matchesSearch = !searchQuery.value ||
          v.modelName.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesBrand = !selectedBrand.value || v.brandName === selectedBrand.value;
        const matchesPrice = v.price >= minPrice.value && v.price <= maxPrice.value;
        return matchesSearch && matchesBrand && matchesPrice;
      });
    });

    const formatPrice = (price) => {
      return price ? `S/ ${price.toFixed(2)}` : "No disponible";
    };

    onMounted(fetchAvailableVehicles);

    return {
      vehicles,
      searchQuery,
      selectedBrand,
      filteredVehicles,
      formatPrice,
      uniqueBrands,
      maxPrice,
      realMaxPrice,
    };
  },
};
</script>

<style scoped>
.vehicle-info,
.vehicle-column,
.rental-column {
  text-align: left;
  color: #111;
  font-size: 1rem;
}

.vehicle-img {
  width: 280px;
  height: 160px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 16px;
  background: #f2f2f2;
  border: 1px solid #ddd;
}

.card-layout {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
}

.active-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.cancel-btn {
  background: #c62828;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cancel-btn:hover {
  background: #a31515;
}

.active-rent-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f4f8f4;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

footer {
  background-color: #4f4d4d;
  padding: 10px 0;
  font-size: 14px;
  color: #ffffffd9;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.content {
  position: absolute;
  top: 60px;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  background: #f4f8f4;
}

.past-rentals {
  width: 300px;
  background: #eafaf1;
  padding: 24px 16px;
  border-right: 2px solid #b2d8b2;
  overflow-y: auto;
}

.past-rentals h3 {
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: #2d4a2f;
}

.rentals-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rental-item {
  margin-bottom: 18px;
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 2px 6px rgba(50, 100, 50, 0.2);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.rental-item:hover {
  transform: scale(1.03);
}

.rental-date {
  font-weight: bold;
  font-size: 1.1rem;
  color: #1a2a1a;
  letter-spacing: 0.5px;
}

.active-rental {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.active-card,
.no-active-card {
  background: linear-gradient(to bottom right, #ffffff, #f4faf4);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(50, 100, 50, 0.2);
  padding: 40px 50px;
  min-width: 440px;
  max-width: 900px;
  width: 100%;
  text-align: center;
  animation: fadeInUp 0.6s ease;
  color: #111;
}

.active-card h2,
.no-active-card h2 {
  margin-bottom: 24px;
  color: #2d4a2f;
  font-size: 2rem;
  font-weight: 700;
}

.vehicle-info {
  font-size: 1.1rem;
  line-height: 1.6;
}

.vehicle-column,
.rental-column {
  font-size: 1.05rem;
  padding: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 48px 40px 36px 40px;
  min-width: 400px;
  max-width: 95vw;
  text-align: center;
  position: relative;
  animation: fadeInUp 0.4s ease;
  color: #111;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #c62828;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: all 0.4s ease;
}

.fade-pop-enter-from,
.fade-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.card-layout .vehicle-column {
  margin-right: 20px;
  border-right: 0.1px solid #ccc;
  padding-right: 102px;
}

.card-layout .rental-column {
  margin-left: 2px;
}
</style>