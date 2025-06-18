<script setup>
import { ref, onMounted } from 'vue';
import rentalService from '@/shared/services/rental-api.service.js';
import VehicleApiService from '@/shared/services/vehicle-api.service.js';
import ModelApiService from '@/shared/services/model-api.service.js';
import BrandApiService from '@/shared/services/brand-api.service.js';
import TheHeaderSession from '@/components/elements/the-header-session.component.vue';
import TheFooter from '@/components/elements/the-footer.component.vue';

const userId = localStorage.getItem('userId');
const activeRental = ref(null);
const pastRentals = ref([]);
const vehicle = ref(null);
const modelName = ref('');
const brandName = ref('');

const showModal = ref(false);
const selectedRental = ref(null);
const selectedVehicle = ref(null);
const selectedModelName = ref('');
const selectedBrandName = ref('');

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

async function fetchRentals() {
  if (!userId) return;
  try {
    const rentals = await rentalService.getByUserId(userId);
    activeRental.value = rentals.find(r => r.rental_status === 'pendiente' || r.rental_status === 'active');
    pastRentals.value = rentals.filter(r => r.rental_status !== 'pendiente' && r.rental_status !== 'active');
    if (activeRental.value && activeRental.value.vehicle_id) {
      const v = await VehicleApiService.getById(activeRental.value.vehicle_id);
      vehicle.value = v.data;
      if (vehicle.value && vehicle.value.model_id) {
        const m = await ModelApiService.getById(vehicle.value.model_id);
        modelName.value = m.data.car_model;
      }
      if (vehicle.value && vehicle.value.brand_id) {
        const b = await BrandApiService.getById(vehicle.value.brand_id);
        brandName.value = b.data.brand_name;
      }
    }
  } catch (e) {
    console.error('Error cargando rentas:', e);
  }
}

onMounted(fetchRentals);

async function openRentalModal(rental) {
  selectedRental.value = rental;
  if (rental.vehicle_id) {
    const v = await VehicleApiService.getById(rental.vehicle_id);
    selectedVehicle.value = v.data;
    if (selectedVehicle.value && selectedVehicle.value.model_id) {
      const m = await ModelApiService.getById(selectedVehicle.value.model_id);
      selectedModelName.value = m.data.car_model;
    }
    if (selectedVehicle.value && selectedVehicle.value.brand_id) {
      const b = await BrandApiService.getById(selectedVehicle.value.brand_id);
      selectedBrandName.value = b.data.brand_name;
    }
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedRental.value = null;
  selectedVehicle.value = null;
  selectedModelName.value = '';
  selectedBrandName.value = '';
}

async function cancelActiveRental() {
  if (!activeRental.value) return;
  const confirmCancel = window.confirm('¿Seguro que deseas cancelar esta reserva?');
  if (!confirmCancel) return;
  try {
    await rentalService.update(activeRental.value.id, {
      ...activeRental.value,
      rental_status: 'finished'
    });
    await fetchRentals();
    alert('Reserva cancelada correctamente.');
  } catch (e) {
    alert('Error al cancelar la reserva.');
  }
}
</script>

<template>
  <div class="active-rent-page">
    <header>
      <TheHeaderSession />
    </header>

    <main class="content">
      <aside class="past-rentals">
        <h3>Rentas Pasadas</h3>
        <ul class="rentals-list">
          <li
              v-for="r in pastRentals"
              :key="r.id"
              class="rental-item"
              @click="openRentalModal(r)"
              style="cursor:pointer"
          >
            <span class="rental-date"><b>📅 {{ formatShortDate(r.start_date || r.rental_start) }}</b></span>
          </li>
        </ul>
      </aside>

      <section class="active-rental">
        <transition name="fade-pop" mode="out-in">
          <div v-if="activeRental" class="active-card" key="with-active">
            <div class="active-header">
              <h2>Renta Actual</h2>
              <button class="cancel-btn" @click="cancelActiveRental">Cancelar</button>
            </div>
            <div class="card-layout">
              <div class="vehicle-column">
                <img v-if="vehicle" :src="vehicle.url" alt="Imagen del vehículo" class="vehicle-img" />
                <p v-if="brandName"><strong>Marca:</strong> {{ brandName }}</p>
                <p v-if="modelName"><strong>Modelo:</strong> {{ modelName }}</p>
                <p v-if="vehicle"><strong>Pasajeros:</strong> {{ vehicle.passengers }}</p>
                <p v-if="vehicle"><strong>Equipaje:</strong> {{ vehicle.luggage_capacity }}</p>
              </div>
              <div class="rental-column">
                <p><strong>📅 Inicio:</strong> {{ formatShortDate(activeRental.start_date || activeRental.rental_start) }}</p>
                <p><strong>⏰ Fin:</strong> {{ formatShortDate(activeRental.end_date || activeRental.rental_end) }}</p>
                <p><strong>🔄 Estado:</strong> {{ activeRental.rental_status }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-active-card" key="no-active">
            <h2>No tienes una renta activa</h2>
          </div>
        </transition>
      </section>

      <!-- Modal renta pasada -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <button class="close-btn" @click="closeModal">✖</button>
          <h3>Detalle de Renta Pasada</h3>
          <div class="card-layout">
            <div class="vehicle-column">
              <img v-if="selectedVehicle" :src="selectedVehicle.url" alt="Imagen del vehículo" class="vehicle-img" />
              <p v-if="selectedBrandName"><strong>Marca:</strong> {{ selectedBrandName }}</p>
              <p v-if="selectedModelName"><strong>Modelo:</strong> {{ selectedModelName }}</p>
              <p v-if="selectedVehicle"><strong>Pasajeros:</strong> {{ selectedVehicle.passengers }}</p>
              <p v-if="selectedVehicle"><strong>Equipaje:</strong> {{ selectedVehicle.luggage_capacity }}</p>
            </div>
            <div class="rental-column">
              <p><strong>📅 Inicio:</strong> {{ formatShortDate(selectedRental.start_date || selectedRental.rental_start) }}</p>
              <p><strong>⏰ Fin:</strong> {{ formatShortDate(selectedRental.end_date || selectedRental.rental_end) }}</p>
              <p><strong>🔄 Estado:</strong> {{ selectedRental.rental_status }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <TheFooter />
    </footer>
  </div>
</template>

<style scoped>
.active-rent-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f8f4;
}

header {
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

footer {
  background-color: #2c3e50;
  padding: 10px 0;
  font-size: 14px;
  color: #ffffffd9;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

main.content {
  flex: 1;
  display: flex;
  background: #f4f8f4;
  padding-top: 20px;
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

.vehicle-column,
.rental-column {
  text-align: left;
  font-size: 1.05rem;
  color: #111;
  padding: 12px;
}

.vehicle-info {
  font-size: 1.1rem;
  line-height: 1.6;
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
