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
          <h2 class="section-title">⏳ Rentas Pendientes (Sin Pagar)</h2>
          <div class="cards-container">
            <div v-for="rental in enrichedPendingRentals" :key="rental.id" class="card pending-card">
              <img :src="rental.vehicleImage" alt="Imagen del vehículo" class="vehicle-img" />
              <div class="card-content">
                <h3 class="vehicle-title">{{ rental.vehicleName }}</h3>
                <p class="rental-status pending">Estado: {{ rental.rentalStatus }}</p>
                <p class="rental-date">📅 Inicio: {{ formatDate(rental.startDate) }}</p>
                <p class="rental-date">📅 Fin: {{ formatDate(rental.endDate) }}</p>
                <p class="rental-location">📍 Recoger vehículo en: {{ rental.locationName }}</p>
                <div class="price-info">
                  <p class="price-detail">💰 {{ formatPrice(rental.pricePerDay) }} x {{ rental.totalDays }} día(s)</p>
                  <p class="total-price">Total: {{ formatPrice(rental.totalPrice) }}</p>
                </div>
                <button 
                  @click="processPayment(rental)"
                  :disabled="paymentProcessing.has(rental.id)"
                  class="pay-button"
                >
                  {{ paymentProcessing.has(rental.id) ? 'Procesando...' : `PAGAR ${formatPrice(rental.totalPrice)}` }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Pago -->
    <div v-if="showPaymentModal" class="payment-modal-overlay" @click="closePaymentModal">
      <div class="payment-modal" @click.stop>
        <div class="modal-header">
          <h3>💳 Procesar Pago</h3>
          <button @click="closePaymentModal" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="payment-summary">
            <h4>Resumen de Pago</h4>
            <p><strong>Vehículo:</strong> {{ selectedRental?.vehicleName }}</p>
            <p><strong>Período:</strong> {{ formatDate(selectedRental?.startDate) }} - {{ formatDate(selectedRental?.endDate) }}</p>
            <p><strong>Días:</strong> {{ selectedRental?.totalDays }}</p>
            <p><strong>Precio por día:</strong> {{ formatPrice(selectedRental?.pricePerDay) }}</p>
            <p class="total-amount"><strong>Total a pagar: {{ formatPrice(selectedRental?.totalPrice) }}</strong></p>
          </div>

          <form @submit.prevent="submitPayment" class="payment-form">
            <div class="form-group">
              <label for="cardNumber">Número de Tarjeta</label>
              <input 
                type="text" 
                id="cardNumber"
                v-model="paymentForm.cardNumber"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                @input="formatCardNumber"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate">Fecha de Vencimiento</label>
                <input 
                  type="text" 
                  id="expiryDate"
                  v-model="paymentForm.expiryDate"
                  placeholder="MM/YY"
                  maxlength="5"
                  @input="formatExpiryDate"
                  required
                />
              </div>
              <div class="form-group">
                <label for="cvv">CVV</label>
                <input 
                  type="text" 
                  id="cvv"
                  v-model="paymentForm.cvv"
                  placeholder="123"
                  maxlength="4"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="cardName">Nombre en la Tarjeta</label>
              <input 
                type="text" 
                id="cardName"
                v-model="paymentForm.cardName"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div class="modal-actions">
              <button type="button" @click="closePaymentModal" class="cancel-btn">
                Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="paymentProcessing.has(selectedRental?.id)"
                class="confirm-pay-btn"
              >
                {{ paymentProcessing.has(selectedRental?.id) ? 'Procesando...' : `Pagar ${formatPrice(selectedRental?.totalPrice)}` }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

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
const paymentProcessing = ref(new Set()); // Para trackear pagos en proceso
const showPaymentModal = ref(false);
const selectedRental = ref(null);
const paymentForm = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardName: ''
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatPrice = (price) => {
  return price ? `S/ ${price.toFixed(2)}` : "S/ 0.00";
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
      rentalApiService.getRentalsPendingUnpaidMe() // Cambiado para obtener solo las no pagadas
    ]);

    // Resolver datos de rentas activas
    const resolvedActiveRentals = await Promise.all(activeRentals.map(async (rental) => {
      return await enrichRentalData(rental);
    }));

    // Resolver datos de rentas pendientes (con información de precio)
    const resolvedPendingRentals = await Promise.all(pendingRentals.map(async (rental) => {
      const enrichedRental = await enrichRentalData(rental);
      // Obtener información adicional del vehículo para cálculo de precio
      try {
        const rentalVehicleInfo = await rentalApiService.getRentalVehicleInformation(rental.id);
        const days = calculateDays(rental.startDate, rental.endDate);
        const totalPrice = rentalVehicleInfo.pricing * days; // Cambiado de .price a .pricing
        enrichedRental.pricePerDay = rentalVehicleInfo.pricing; // Cambiado de .price a .pricing
        enrichedRental.totalDays = days;
        enrichedRental.totalPrice = totalPrice;
      } catch (e) {
        console.error("❌ Error obteniendo información de precio:", e);
        enrichedRental.pricePerDay = 0;
        enrichedRental.totalDays = 0;
        enrichedRental.totalPrice = 0;
      }
      return enrichedRental;
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

const processPayment = async (rental) => {
  if (paymentProcessing.value.has(rental.id)) return;
  
  selectedRental.value = rental;
  showPaymentModal.value = true;
  
  // Resetear formulario
  paymentForm.value = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  };
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
  selectedRental.value = null;
  paymentForm.value = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  };
};

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  paymentForm.value.cardNumber = value;
};

const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  paymentForm.value.expiryDate = value;
};

const submitPayment = async () => {
  if (!selectedRental.value) return;
  
  try {
    paymentProcessing.value.add(selectedRental.value.id);
    
    // Simular validación del formulario
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Llamar al endpoint real de pago
    await rentalApiService.markRentalAsPaid(selectedRental.value.id);
    
    alert("¡Pago procesado exitosamente!");
    
    // Cerrar modal y recargar rentas
    closePaymentModal();
    await fetchMyRentals();
    
  } catch (error) {
    console.error("Error procesando el pago:", error);
    alert("Error al procesar el pago. Intenta nuevamente.");
  } finally {
    paymentProcessing.value.delete(selectedRental.value.id);
  }
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

.price-info {
  margin: 12px 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #ff9800;
}

.price-detail {
  font-size: 0.9rem;
  color: #666;
  margin: 2px 0;
}

.total-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2e7d32;
  margin: 4px 0 0 0;
}

.pay-button {
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

.pay-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #f57c00, #ef6c00);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.pay-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Modal de Pago */
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.payment-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #2e7d32;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 20px 24px 24px;
}

.payment-summary {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #ff9800;
}

.payment-summary h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.1rem;
}

.payment-summary p {
  margin: 4px 0;
  font-size: 0.95rem;
  color: #555;
}

.total-amount {
  font-size: 1.1rem !important;
  color: #2e7d32 !important;
  border-top: 1px solid #ddd;
  padding-top: 8px;
  margin-top: 8px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-group input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #ff9800;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  flex: 1;
  padding: 12px 20px;
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #eeeeee;
  border-color: #ccc;
}

.confirm-pay-btn {
  flex: 2;
  padding: 12px 20px;
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-pay-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #f57c00, #ef6c00);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.confirm-pay-btn:disabled {
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
