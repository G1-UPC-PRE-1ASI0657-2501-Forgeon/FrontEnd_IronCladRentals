<template>
  <div class="search-vehicles">
    <header>
      <TheHeaderSession />
    </header>
    <div class="content">
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
      <div class="cards-container">
        <div
            v-for="vehicle in filteredVehicles"
            :key="vehicle.id"
            class="card"
            @click="$router.push(`/vehicle/${vehicle.id}`)"
        >
          <div class="card-content">
            <h2 class="vehicle-title">{{ getBrandName(vehicle.brand_id) }} - {{ getModelName(vehicle.model_id) }}</h2>
            <p class="vehicle-info">Pasajeros: {{ vehicle.passengers }}</p>
            <p class="vehicle-info">Equipaje: {{ vehicle.luggage_capacity }}</p>
          </div>
        </div>
      </div>
    </div>
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
      vehicles.value = v.data.filter((vehicle) => vehicle.available); // Solo vehículos disponibles
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
/* Contenedor principal */
.content {
  position: fixed;
  top: 10%; /* Ajustado para dejar más espacio debajo del header */
  left: 0;
  width: 100%;
  height: 90%; /* Reducido para evitar solapamiento con el footer */
  padding: 20px 10px; /* Espaciado interno reducido */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto; /* Permitir scroll si el contenido excede la pantalla */
}

/* Título de la página */
.page-title {
  text-align: center;
  font-size: 2rem; /* Tamaño reducido */
  color: #1a493f;
  font-weight: bold;
  margin: 10px 0; /* Margen reducido */
}

/* Filtros */
.filters {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Espaciado reducido */
  margin-bottom: 10px; /* Separación reducida */
  width: 100%;
  max-width: 1000px; /* Ancho máximo reducido */
}

/* Barra de búsqueda */
.search-bar {
  padding: 8px; /* Espaciado interno reducido */
  font-size: 0.8rem; /* Tamaño de fuente reducido */
  border: 1px solid #ccc;
  border-radius: 6px; /* Bordes más pequeños */
  width: 250px; /* Ancho reducido */
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-bar:focus {
  border-color: #1a493f;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  outline: none;
  transform: scale(1.02); /* Escala reducida */
}

/* Filtro de marcas */
.brand-filter {
  padding: 8px;
  font-size: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.brand-filter:focus {
  border-color: #1a493f;
  outline: none;
}

/* Contenedor de las tarjetas */
.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px; /* Espaciado reducido */
  width: 100%;
  max-width: 1000px; /* Ancho máximo reducido */
  margin-top: 10px; /* Separación reducida */
  flex-grow: 1;
}

/* Tarjetas */
.card {
  flex: 1 1 calc(25% - 10px); /* Cuatro tarjetas por fila con espacio */
  max-width: calc(25% - 10px);
  max-height: 300px; /* Altura máxima para evitar alargamiento */
  background-color: #fff;
  border-radius: 10px; /* Bordes más pequeños */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribuir contenido */
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.card-content {
  padding: 12px; /* Espaciado interno reducido */
  text-align: center;
  flex-grow: 1; /* Asegurar que el contenido ocupe el espacio disponible */
}

.vehicle-title {
  font-size: 1.2rem; /* Tamaño reducido */
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: bold;
}

.vehicle-info {
  font-size: 0.8rem; /* Tamaño reducido */
  color: #555;
  margin: 5px 0; /* Margen reducido */
}

/* Footer */
footer {
  background-color: #4f4d4d;
  padding: 8px 0; /* Espaciado reducido */
  font-size: 14px; /* Tamaño reducido */
  line-height: 22px;
  color: #737373;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* Header */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>