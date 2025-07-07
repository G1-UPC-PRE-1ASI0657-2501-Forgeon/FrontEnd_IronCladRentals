<template>
  <div class="active-rentals">

    <main class="content">
      <h1 class="page-title">Mis Rentas</h1>

      <div v-if="loading" class="loading">Cargando rentas...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="enrichedActiveRentals.length === 0 && enrichedPendingRentals.length === 0" class="empty-message">
        No tienes rentas activas ni pendientes.
      </div>

      <div v-else class="rentals-sections">
        <!-- Sección de Rentas Activas -->
        <div v-if="enrichedActiveRentals.length > 0" class="section">
          <h2 class="section-title">🚗 Rentas Activas</h2>
          <div class="cards-container">
            <div v-for="rental in enrichedActiveRentals" :key="rental.id" class="card active-card">
              <img :src="rental.vehicleImage" alt="Imagen del vehículo" class="vehicle-img" />
              <div class="card-content">
                <h3 class="vehicle-title">{{ rental.vehicleName }}</h3>
                <p class="rental-status active">Estado: {{ rental.rentalStatus }}</p>
                <p class="rental-date">📅 Inicio: {{ formatDate(rental.startDate) }}</p>
                <p class="rental-date">📅 Fin: {{ formatDate(rental.endDate) }}</p>
                <p class="rental-location">📍 Recoger vehículo en: {{ rental.locationName }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de Rentas Pendientes -->
        <div v-if="enrichedPendingRentals.length > 0" class="section">
          <h2 class="section-title">⏳ Rentas Pendientes</h2>
          <div class="cards-container">
            <div v-for="rental in enrichedPendingRentals" :key="rental.id" class="card pending-card">
              <img :src="rental.vehicleImage" alt="Imagen del vehículo" class="vehicle-img" />
              <div class="card-content">
                <h3 class="vehicle-title">{{ rental.vehicleName }}</h3>
                <p class="rental-status pending">Estado: {{ rental.rentalStatus }}</p>
                <p class="rental-date">📅 Inicio: {{ formatDate(rental.startDate) }}</p>
                <p class="rental-date">📅 Fin: {{ formatDate(rental.endDate) }}</p>
                <p class="rental-location">📍 Recoger vehículo en: {{ rental.locationName }}</p>
              </div>
            </div>
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
const enrichedActiveRentals = ref([]);
const enrichedPendingRentals = ref([]);

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const fetchMyRentals = async () => {
  try {
    loading.value = true;
    error.value = "";
    enrichedActiveRentals.value = [];
    enrichedPendingRentals.value = [];

    // Obtener rentas activas y pendientes en paralelo
    const [activeRentals, pendingRentals] = await Promise.all([
      rentalApiService.getRentalsActiveMe(),
      rentalApiService.getRentalsPendingMe()
    ]);

    // Resolver datos de rentas activas
    const resolvedActiveRentals = await Promise.all(activeRentals.map(async (rental) => {
      return await enrichRentalData(rental);
    }));

    // Resolver datos de rentas pendientes
    const resolvedPendingRentals = await Promise.all(pendingRentals.map(async (rental) => {
      return await enrichRentalData(rental);
    }));

    enrichedActiveRentals.value = resolvedActiveRentals;
    enrichedPendingRentals.value = resolvedPendingRentals;
  } catch (err) {
    console.error(err);
    error.value = "Error cargando tus rentas.";
  } finally {
    loading.value = false;
  }
};

const enrichRentalData = async (rental) => {
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
};

onMounted(fetchMyRentals);
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
.empty-message {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 20px;
  color: #4a764a;
}

.rentals-sections {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
}

.section {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  color: #2e7d32;
  margin-bottom: 20px;
  text-align: center;
  padding: 12px 0;
  border-bottom: 2px solid #e0e0e0;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
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

.active-card {
  border-left: 4px solid #2e7d32;
}

.pending-card {
  border-left: 4px solid #ff9800;
}

.card-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-content h2,
.card-content h3 {
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

.rental-status {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.rental-status.active {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.rental-status.pending {
  background-color: #fff3e0;
  color: #f57c00;
}

.vehicle-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
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

/* Responsive design */
@media (max-width: 768px) {
  .rentals-sections {
    flex-direction: column;
    gap: 30px;
  }
  
  .section {
    width: 100%;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .card {
    flex: 1 1 100%;
    max-width: 100%;
  }
  
  .page-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .content {
    padding: 15px;
  }
}
</style>
