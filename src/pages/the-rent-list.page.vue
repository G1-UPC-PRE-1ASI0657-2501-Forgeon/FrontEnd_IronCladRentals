<template>
  <div class="landlord-rentals">
    <header>
      <TheHeaderSession />
    </header>
    <div class="content">
      <h1 class="page-title">Rentas de Mis Vehículos</h1>

      <transition-group name="fade" tag="div" class="cards-container">
        <div v-for="(rental, index) in rentals" :key="rental.id" class="card1">
          <div class="p-4 border-round surface-card shadow-2 card-content">
            <div class="flex flex-column align-items-center">
              <!-- Imagen del vehículo -->
              <img :src="getVehicleImage(rental.vehicle_id)" alt="Imagen del vehículo" class="vehicle-image mb-3" />

              <!-- Información del vehículo -->
              <h2 class="vehicle-title">{{ getVehicleInfo(rental.vehicle_id) }}</h2>

              <!-- Fechas de renta -->
              <p class="rental-info">Inicio: {{ formatDate(rental.start_date) }}</p>
              <p class="rental-info">Fin: {{ formatDate(rental.end_date) }}</p>

              <!-- Nombre del usuario -->
              <p class="rental-info">Arrendatario: {{ getUserName(rental.user_id) }}</p>

              <!-- Ubicación -->
              <p class="rental-info">Ubicación: {{ getLocationName(rental.location_id) }}</p>

              <!-- Estado de la renta -->
              <Tag :value="rental.rental_status" :severity="getStatusSeverity(rental.rental_status)" class="mb-3" />
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <footer>
      <TheFooter />
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Tag from "primevue/tag";
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import vehicleApiService from "@/shared/services/vehicle-api.service.js";
import rentalApiService from "@/shared/services/rental-api.service.js";
import userService from "@/shared/services/user-api.service.js";
import locationApiService from "@/shared/services/location-api.service.js";

export default {
  name: "LandlordRentals",
  components: {
    Tag,
    TheHeaderSession,
    TheFooter,
  },
  setup() {
    const rentals = ref([]);
    const vehicles = ref([]);
    const users = ref([]);
    const locations = ref([]);

    const fetchRentals = async () => {
      try {
        const companyId = localStorage.getItem("companyId");
        if (!companyId) {
          console.error("No se encontró el ID de la compañía en localStorage.");
          return;
        }

        const [vehicleRes, rentalRes, userRes, locationRes] = await Promise.all([
          vehicleApiService.getAll(),
          rentalApiService.getAll(),
          userService.getAll(),
          locationApiService.getAll(),
        ]);

        vehicles.value = vehicleRes.data.filter((v) => v.companyId === companyId);
        rentals.value = rentalRes.filter((r) =>
            vehicles.value.some((v) => v.id === r.vehicle_id)
        );
        users.value = userRes;
        locations.value = locationRes.data;
      } catch (error) {
        console.error("Error al obtener rentas, vehículos, usuarios o ubicaciones:", error);
      }
    };

    const getVehicleInfo = (vehicleId) => {
      const vehicle = vehicles.value.find((v) => v.id === vehicleId);
      return vehicle ? `${vehicle.brand_id} - ${vehicle.model_id}` : "Desconocido";
    };

    const getVehicleImage = (vehicleId) => {
      const vehicle = vehicles.value.find((v) => v.id === vehicleId);
      return vehicle ? vehicle.url : "https://via.placeholder.com/150";
    };

    const getUserName = (userId) => {
      const user = users.value.find((u) => u.id === userId);
      return user ? user.names : "Desconocido";
    };

    const getLocationName = (locationId) => {
      const location = locations.value.find((loc) => loc.id === locationId);
      return location ? `${location.city} - ${location.address}` : "Desconocido";
    };

    const formatDate = (date) => {
      return new Intl.DateTimeFormat("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date));
    };

    const getStatusSeverity = (status) => {
      switch (status) {
        case "active":
          return "success";
        case "pendiente":
          return "warning";
        default:
          return "danger";
      }
    };

    onMounted(fetchRentals);

    return {
      rentals,
      getVehicleInfo,
      getVehicleImage,
      getUserName,
      getLocationName,
      formatDate,
      getStatusSeverity,
    };
  },
};
</script>

<style scoped>

.vehicle-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
.landlord-rentals {
  background: linear-gradient(to bottom right, #a3d1b1, #a4ffaf);
  min-height: 100vh;
  padding-top: 100px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #08351a;
  font-weight: bold;
  margin-bottom: 20px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
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

.vehicle-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b4332;
  margin-bottom: 12px;
}

.rental-info {
  font-size: 1rem;
  color: #407148;
  margin: 6px 0;
}

footer {
  background-color: #1a1a1a;
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

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>