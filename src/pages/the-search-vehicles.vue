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
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.brand_name }}
          </option>
        </select>
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
            <h2 class="vehicle-title">{{ getBrandName(vehicle.brand_id) }} - {{ getModelName(vehicle.model_id) }}</h2>
            <p class="vehicle-info">
              <span>🚗 Pasajeros:</span> {{ vehicle.passengers }}
            </p>
            <p class="vehicle-info">
              <span>🧳 Equipaje:</span> {{ vehicle.luggage_capacity }}
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
import { ref, computed, onMounted } from "vue";
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import { VehicleApiService } from "@/shared/services/vehicle-api.service.js";
import { BrandApiService } from "@/shared/services/brand-api.service.js";
import { ModelApiService } from "@/shared/services/model-api.service.js";

export default {
  name: "SearchVehicles",
  components: {
    TheHeaderSession,
    TheFooter,
  },
  setup() {
    const vehicles = ref([]);
    const brands = ref([]);
    const models = ref([]);
    const searchQuery = ref("");
    const selectedBrand = ref("");

    const vehicleApiService = new VehicleApiService();
    const brandApiService = new BrandApiService();
    const modelApiService = new ModelApiService();

    const fetchAll = async () => {
      const [v, b, m] = await Promise.all([
        vehicleApiService.getAll(),
        brandApiService.getAll(),
        modelApiService.getAll(),
      ]);
      vehicles.value = v.data.filter((vehicle) => vehicle.available);
      brands.value = b.data;
      models.value = m.data;
    };

    const getBrandName = (id) => {
      const brand = brands.value.find((b) => b.id === id);
      return brand ? brand.brand_name : "Desconocido";
    };

    const getModelName = (id) => {
      const model = models.value.find((m) => m.id === id);
      return model ? model.car_model : "Desconocido";
    };

    const filteredVehicles = computed(() => {
      return vehicles.value.filter((vehicle) => {
        const matchesSearch =
            !searchQuery.value ||
            getModelName(vehicle.model_id)
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase());
        const matchesBrand =
            !selectedBrand.value || vehicle.brand_id === selectedBrand.value;
        return matchesSearch && matchesBrand;
      });
    });

    onMounted(fetchAll);

    return {
      vehicles,
      brands,
      searchQuery,
      selectedBrand,
      filteredVehicles,
      getBrandName,
      getModelName,
    };
  },
};
</script>

<style scoped>
.content {
  position: fixed;
  top: 60px; /* altura del header */
  bottom: 50px; /* altura del footer */
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

/* Animaciones para cards usando transition-group */
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

footer {
  background-color: #496b49;
  padding: 12px 0;
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
