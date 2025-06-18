<template>
  <div class="rent-creation">
    <TheHeaderSession />
    <div class="content">
      <h1 class="title">Crear Renta</h1>
      <div class="form-container">
        <div class="form-columns">
          <div class="form-left">
            <div class="form-group">
              <label>Fecha de inicio</label>
              <Calendar v-model="rental.start_date" dateFormat="yy-mm-dd" showIcon class="calendar-input" />
            </div>
            <div class="form-group">
              <label>Fecha de término</label>
              <Calendar v-model="rental.end_date" dateFormat="yy-mm-dd" showIcon class="calendar-input" />
            </div>
          </div>
          <div class="form-right">
            <label>Ubicación de entrega</label>
            <div id="map" class="map"></div>
            <p v-if="selectedLocation" class="selected-location">
              Ubicación seleccionada: {{ selectedLocation.label }}
            </p>
          </div>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <Button
            label="Confirmar Renta"
            class="submit-btn"
            @click="validateAndCreateRental"
        />
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";

import rentalApiService from "@/shared/services/rental-api.service.js";
import locationApiService from "@/shared/services/location-api.service.js";
import VehicleApiService from "@/shared/services/vehicle-api.service.js";

export default {
  components: {
    Calendar,
    Button,
    TheHeaderSession,
    TheFooter,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const rental = ref({
      vehicle_id: null,
      user_id: null,
      location_id: null,
      start_date: null,
      end_date: null,
      rental_status: "active",
    });

    const locations = ref([]);
    const selectedLocation = ref(null);
    const errorMessage = ref("");
    let map = null;

    const fetchLocations = async () => {
      try {
        const vehicleId = route.params.id;
        if (!vehicleId) {
          errorMessage.value = "No se encontró el ID del vehículo en la URL.";
          return;
        }
        // Obtener el vehículo para saber su companyId
        const vehicleRes = await VehicleApiService.getById(vehicleId);
        const vehicle = vehicleRes.data || vehicleRes;
        const companyId = vehicle.companyId;

        // Obtener ubicaciones activas de esa compañía
        const res = await locationApiService.getAll();
        locations.value = (res.data || res)
            .filter(
                (loc) =>
                    loc.location_status === "active" &&
                    loc.company_id === companyId
            )
            .map((loc) => ({
              id: loc.id,
              label: `${loc.address} (${loc.latitude}, ${loc.longitude})`,
              latitude: loc.latitude,
              longitude: loc.longitude,
            }));

        if (locations.value.length) {
          const first = locations.value[0];
          // Destruir el mapa anterior si existe
          if (map) {
            map.remove();
          }
          map = L.map("map").setView([first.latitude, first.longitude], 13);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
          }).addTo(map);

          locations.value.forEach(loc => {
            const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
            marker.bindPopup(loc.label);
            marker.on("click", () => {
              selectedLocation.value = loc;
              rental.value.location_id = loc.id;
            });
          });
        }
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
      }
    };

    const validateAndCreateRental = async () => {
      const vehicleId = route.params.id;
      if (!vehicleId) {
        errorMessage.value = "No se encontró el ID del vehículo en la URL.";
        return;
      }
      rental.value.vehicle_id = vehicleId;

      const userId = localStorage.getItem("userId");
      if (!userId) {
        errorMessage.value = "No se encontró el ID del usuario en el localStorage.";
        return;
      }
      rental.value.user_id = userId;

      if (!rental.value.start_date || !rental.value.end_date) {
        errorMessage.value = "Por favor, selecciona ambas fechas.";
        return;
      }
      if (new Date(rental.value.start_date) >= new Date(rental.value.end_date)) {
        errorMessage.value = "La fecha de inicio debe ser anterior a la fecha de término.";
        return;
      }
      if (!rental.value.location_id) {
        errorMessage.value = "Por favor, selecciona una ubicación en el mapa.";
        return;
      }

      try {
        await rentalApiService.create(rental.value);
        alert("¡Renta creada con éxito!");
        router.push("/search-vehicles");
      } catch (error) {
        console.error("Error al crear la renta:", error);
        errorMessage.value = "Error al crear la renta. Intenta nuevamente.";
      }
    };

    onMounted(fetchLocations);

    return {
      rental,
      locations,
      selectedLocation,
      errorMessage,
      validateAndCreateRental,
    };
  },
};
</script>

<style scoped>
.rent-creation {
  background: linear-gradient(135deg, #e9f5f3, #b2d8b2);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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

.title {
  text-align: center;
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #2e7d32;
}

.form-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(50, 100, 50, 0.13);
  width: 90%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Nuevo layout: columnas lado a lado */
.form-columns {
  display: flex;
  gap: 30px;
  width: 100%;
}

.form-left,
.form-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 7px;
  font-size: 1.08em;
}

.calendar-input {
  width: 100%;
}

.map {
  width: 100%;
  height: 320px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1.5px solid #b2d8b2;
  box-shadow: 0 2px 8px rgba(50, 100, 50, 0.08);
}

.selected-location {
  color: #388e3c;
  font-size: 1em;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(90deg, #2e7d32 60%, #66bb6a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px;
  font-size: 1.13rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #1b5e20 60%, #388e3c 100%);
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
.error-message {
  color: #d32f2f;
  font-weight: bold;
  text-align: center;
  font-size: 1.02em;
  border-radius: 6px;
  background: #ffeaea;
  padding: 7px;
}

/* Responsive */
@media (max-width: 900px) {
  .form-columns {
    flex-direction: column;
  }
  .form-left,
  .form-right {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .form-container {
    padding: 1rem;
  }
  .title {
    font-size: 1.8rem;
  }
}
</style>