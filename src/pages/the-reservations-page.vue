<template>
  <div class="pending-rentals">
    <TheHeaderSession />

    <main class="content">
      <h1 class="page-title">Gestión de Reservas</h1>

      <div v-if="loading" class="loading">Cargando reservas...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="enrichedPendingRentals.length === 0 && enrichedActiveRentals.length === 0" class="empty-message">
        No hay reservas pendientes ni activas.
      </div>

      <div v-else class="rentals-sections">
        <!-- Sección de Reservas Pendientes (Pagadas pero no confirmadas) -->
        <div class="section">
          <h2 class="section-title">⏳ Reservas Pendientes (Por Confirmar)</h2>
          <div v-if="enrichedPendingRentals.length === 0" class="empty-message">
            No hay reservas pendientes.
          </div>
          <div v-else class="cards-container">
            <div v-for="rental in enrichedPendingRentals" :key="rental.id" class="card pending-card">
              <img :src="rental.vehicleImage" alt="Imagen del vehículo" class="vehicle-img" />
              <div class="card-content">
                <h3 class="vehicle-title">{{ rental.vehicleName }}</h3>
                <p class="rental-status pending">Estado: {{ rental.rentalStatus }}</p>
                <p class="rental-date">📅 Inicio: {{ formatDate(rental.startDate) }}</p>
                <p class="rental-date">📅 Fin: {{ formatDate(rental.endDate) }}</p>
                <p class="rental-user">👤 Arrendatario: {{ rental.renterName }}</p>
                <p class="rental-location">📍 Recoger en: {{ rental.locationName }}</p>
                <button 
                  @click="confirmRental(rental)"
                  :disabled="processingConfirm.has(rental.id)"
                  class="confirm-button"
                >
                  {{ processingConfirm.has(rental.id) ? 'Confirmando...' : 'Confirmar Reserva' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de Reservas Activas (Confirmadas) -->
        <div v-if="enrichedActiveRentals.length > 0" class="section">
          <h2 class="section-title">🚗 Reservas Activas (Confirmadas)</h2>
          <div class="cards-container">
            <div v-for="rental in enrichedActiveRentals" :key="rental.id" class="card active-card">
              <img :src="rental.vehicleImage" alt="Imagen del vehículo" class="vehicle-img" />
              <div class="card-content">
                <h3 class="vehicle-title">{{ rental.vehicleName }}</h3>
                <p class="rental-status active">Estado: {{ rental.rentalStatus }}</p>
                <p class="rental-date">📅 Inicio: {{ formatDate(rental.startDate) }}</p>
                <p class="rental-date">📅 Fin: {{ formatDate(rental.endDate) }}</p>
                <p class="rental-user">👤 Arrendatario: {{ rental.renterName }}</p>
                <p class="rental-location">📍 Recoger en: {{ rental.locationName }}</p>
                <button 
                  @click="completeRental(rental)"
                  :disabled="processingComplete.has(rental.id)"
                  class="complete-button"
                >
                  {{ processingComplete.has(rental.id) ? 'Finalizando...' : 'Finalizar renta' }}
                </button>
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
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import rentalService from "@/shared/services/rental-api.service.js";
import userService from "@/shared/services/user-api.service.js";
import vehicleService from "@/shared/services/vehicle-api.service.js";

const rentals = ref([]);
const enrichedPendingRentals = ref([]);
const enrichedActiveRentals = ref([]);
const loading = ref(true);
const error = ref("");
const processingConfirm = ref(new Set());
const processingComplete = ref(new Set());

const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

const fetchAllRentals = async () => {
  try {
    loading.value = true;
    error.value = "";
    enrichedPendingRentals.value = [];
    enrichedActiveRentals.value = [];

    console.log("🔄 Iniciando carga de reservas...");

    // 1️⃣ Obtener los datos de la compañía del usuario actual
    const company = await vehicleService.getCompanyMe();
    if (!company || !company.companyId) {
      error.value = "No tienes una compañía asociada.";
      console.log("❌ No hay compañía asociada");
      return;
    }

    const companyId = company.companyId;
    console.log("✅ Company obtenida:", company);

    // 2️⃣ Obtener rentas pendientes y activas en paralelo
    console.log("🔄 Obteniendo rentas pendientes y activas...");
    
    let pendingRentals = [];
    let activeRentals = [];
    
    try {
      pendingRentals = await rentalService.getByCompanyId(companyId); // Rentas pagadas pero no confirmadas
      console.log("✅ Rentas pendientes obtenidas:", pendingRentals);
    } catch (error) {
      console.error("❌ Error obteniendo rentas pendientes:", error);
      pendingRentals = [];
    }
    
    try {
      activeRentals = await rentalService.getActiveByCompanyId(companyId); // Rentas confirmadas (activas)
      console.log("✅ Rentas activas obtenidas:", activeRentals);
    } catch (error) {
      console.error("❌ Error obteniendo rentas activas:", error);
      activeRentals = [];
    }

    // 3️⃣ Enriquecer rentas pendientes
    const enrichedPending = pendingRentals && pendingRentals.length > 0 
      ? await Promise.all(pendingRentals.map(async (rental) => {
          return await enrichRentalData(rental);
        })) 
      : [];

    // 4️⃣ Enriquecer rentas activas
    const enrichedActive = activeRentals && activeRentals.length > 0 
      ? await Promise.all(activeRentals.map(async (rental) => {
          return await enrichRentalData(rental);
        })) 
      : [];

    enrichedPendingRentals.value = enrichedPending;
    enrichedActiveRentals.value = enrichedActive;

    console.log("✅ Rentas pendientes enriquecidas:", enrichedPending);
    console.log("✅ Rentas activas enriquecidas:", enrichedActive);

  } catch (err) {
    console.error(err);
    error.value = "Error cargando reservas.";
  } finally {
    loading.value = false;
  }
};

const enrichRentalData = async (rental) => {
  try {
    const [vehicle, renter, location] = await Promise.all([
      vehicleService.getById(rental.vehicleId),
      userService.getById(rental.userId),
      vehicleService.getLocationById(rental.locationId)
    ]);

    return {
      id: rental.id,
      rentalStatus: rental.rentalStatus,
      startDate: rental.startDate,
      endDate: rental.endDate,
      renterName: renter ? renter.name : "Desconocido",
      locationName: location ? `${location.city} - ${location.address}` : "Desconocida",
      vehicleName: vehicle ? `${vehicle.brandName} - ${vehicle.modelName}` : "Desconocido",
      vehicleImage: vehicle?.imageUrl ?? "https://via.placeholder.com/300x200?text=Sin+imagen"
    };
  } catch (error) {
    console.error("❌ Error enriqueciendo datos de renta:", error);
    return {
      id: rental.id,
      rentalStatus: rental.rentalStatus,
      startDate: rental.startDate,
      endDate: rental.endDate,
      renterName: "Desconocido",
      locationName: "Desconocida",
      vehicleName: "Desconocido",
      vehicleImage: "https://via.placeholder.com/300x200?text=Sin+imagen"
    };
  }
};

const confirmRental = async (rental) => {
  if (processingConfirm.value.has(rental.id)) return;
  
  try {
    processingConfirm.value.add(rental.id);
    
    // Confirmar la reserva
    await rentalService.confirmRental(rental.id);
    
    alert(`¡Reserva confirmada exitosamente para ${rental.renterName}!`);
    
    // Recargar las listas
    await fetchAllRentals();
    
  } catch (error) {
    console.error("Error confirmando reserva:", error);
    alert("Error al confirmar la reserva. Intenta nuevamente.");
  } finally {
    processingConfirm.value.delete(rental.id);
  }
};

const completeRental = async (rental) => {
  if (processingComplete.value.has(rental.id)) return;
  
  try {
    processingComplete.value.add(rental.id);
    
    // Completar la reserva
    await rentalService.completeRental(rental.id);
    
    alert(`¡Renta finalizada exitosamente para ${rental.renterName}!`);
    
    // Recargar las listas
    await fetchAllRentals();
    
  } catch (error) {
    console.error("Error finalizando renta:", error);
    alert("Error al finalizar la renta. Intenta nuevamente.");
  } finally {
    processingComplete.value.delete(rental.id);
  }
};

onMounted(fetchAllRentals);
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

.pending-card {
  border-left: 4px solid #ff9800;
}

.active-card {
  border-left: 4px solid #2e7d32;
}

.vehicle-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
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

.rental-status.pending {
  background-color: #fff3e0;
  color: #f57c00;
}

.rental-status.active {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.confirm-button {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  width: 100%;
}

.confirm-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #f57c00, #ef6c00);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.confirm-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.complete-button {
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  width: 100%;
}

.complete-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1b5e20, #0d4d14);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.complete-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
