<template>
  <div class="active-rentals">

    <main class="content">
      <h1 class="page-title">Mis Rentas Activas</h1>

      <div v-if="loading" class="loading">Cargando rentas...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="enrichedRentals.length === 0" class="empty-message">
        No tienes rentas activas.
      </div>

      <div v-else class="cards-container">
        <div v-for="rental in enrichedRentals" :key="rental.id" class="card">
          <img :src="rental.vehicleImage" alt="Imagen del vehículo" class="vehicle-img" />
          <div class="card-content">
            <h2 class="vehicle-title">{{ rental.vehicleName }}</h2>
            <p class="rental-status">Estado: {{ rental.rentalStatus }}</p>
            <p class="rental-date">📅 Inicio: {{ formatDate(rental.startDate) }}</p>
            <p class="rental-date">📅 Fin: {{ formatDate(rental.endDate) }}</p>
            <p class="rental-location">📍 Recoger vehículo en: {{ rental.locationName }}</p>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>



<script setup>
import { ref, onMounted } from "vue";
import rentalApiService from "@/shared/services/rental-api.service";
import vehicleService from "@/shared/services/vehicle-api.service";
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";

const loading = ref(true);
const error = ref("");
const enrichedRentals = ref([]);

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const fetchMyActiveRentals = async () => {
  try {
    loading.value = true;
    error.value = "";
    enrichedRentals.value = [];

    // Obtener rentas activas de mi cuenta
    const rentals = await rentalApiService.getRentalsActiveMe();

    // Resolver datos de cada renta
    const resolved = await Promise.all(rentals.map(async (rental) => {
      let vehicleName = "Desconocido";
      let vehicleImage = "https://via.placeholder.com/300x200?text=Sin+imagen";
      let locationName = "Desconocida";

      try {
        const vehicle = await vehicleService.getById(rental.vehicleId);
        vehicleName = `${vehicle.brandName} - ${vehicle.modelName}`;
        vehicleImage = vehicle.imageUrl;
      } catch (e) {
        console.error("❌ Error cargando vehículo:", e);
      }

      try {
        const location = await vehicleService.getLocationById(rental.locationId);
        locationName = `${location.city} - ${location.address}`;
      } catch (e) {
        console.error("❌ Error cargando ubicación:", e);
      }

      return {
        id: rental.id,
        rentalStatus: rental.rentalStatus,
        startDate: rental.startDate,
        endDate: rental.endDate,
        vehicleName,
        vehicleImage,
        locationName,
      };
    }));

    enrichedRentals.value = resolved;
  } catch (err) {
    console.error(err);
    error.value = "Error cargando tus rentas activas.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMyActiveRentals);
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
  font-size: 2.3rem;
  color: #3a5d3a;
  margin-bottom: 24px;
  text-align: center;
}

.loading,
.error,
.no-results {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 20px;
  color: #4a764a;
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

.card-content h2 {
  font-size: 1.4rem;
  color: #356635;
  margin-bottom: 8px;
}

.card-content p {
  font-size: 1rem;
  color: #4f794f;
  margin: 4px 0;
  font-weight: 500;
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
</style>
