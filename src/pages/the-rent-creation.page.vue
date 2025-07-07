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
              <Calendar v-model="rental.startDate" dateFormat="yy-mm-dd" showIcon class="calendar-input" />
            </div>
            <div class="form-group">
              <label>Fecha de término</label>
              <Calendar v-model="rental.endDate" dateFormat="yy-mm-dd" showIcon class="calendar-input" />
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
        <div class="button-group">
          <Button
              label="← Volver a Detalles"
              class="back-btn"
              @click="goBackToVehicleDetails"
          />
          <Button
              label="Confirmar Renta"
              class="submit-btn"
              @click="validateAndCreateRental"
          />
        </div>
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

import TheHeaderArrendatario from "@/components/elements/the-header-arrendatario.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";

import rentalApiService from "@/shared/services/rental-api.service.js";
import vehicleService from "@/shared/services/vehicle-api.service.js";
import userService from "@/shared/services/user-api.service.js";

export default {
  components: {
    Calendar,
    Button,
    TheHeaderArrendatario,
    TheFooter,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const rental = ref({
      vehicleId: null,
      userId: null,
      locationId: null,
      startDate: null,
      endDate: null,
      rentalStatus: "Pending",  // Default
    });

    const locations = ref([]);
    const selectedLocation = ref(null);
    const errorMessage = ref("");
    let mapInstance = null;
    let markersLayer = null;

    const fetchVehicleAndLocations = async () => {
      try {
        const vehicleId = route.params.id;
        if (!vehicleId) {
          errorMessage.value = "No se encontró el ID del vehículo en la URL.";
          return;
        }

        const vehicle = await vehicleService.getById(vehicleId);
        rental.value.vehicleId = vehicleId;

        if (!vehicle || !vehicle.companyId) {
          errorMessage.value = "No se pudo determinar la compañía del vehículo.";
          return;
        }

        const res = await vehicleService.getCompanyLocations(vehicle.companyId);
        locations.value = (res.data || res)
          .filter(loc => loc.locationStatus?.toLowerCase() === "activo")
          .map(loc => ({
            id: loc.id,
            label: `${loc.city} - ${loc.address}`,
            latitude: loc.latitude,
            longitude: loc.longitude,
          }));

        if (!locations.value.length) {
          errorMessage.value = "La compañía no tiene ubicaciones activas.";
          return;
        }

        initMapWithLocations();

      } catch (error) {
        console.error("Error cargando datos:", error);
        errorMessage.value = "Error al cargar datos. Intenta más tarde.";
      }
    };

    const initMapWithLocations = () => {
      if (!locations.value.length) return;

      selectedLocation.value = locations.value[0];
      rental.value.locationId = locations.value[0].id;

      const first = locations.value[0];

      if (!mapInstance) {
        mapInstance = L.map("map").setView([first.latitude, first.longitude], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors"
        }).addTo(mapInstance);
      }

      if (markersLayer) {
        markersLayer.clearLayers();
      } else {
        markersLayer = L.layerGroup().addTo(mapInstance);
      }

      locations.value.forEach(loc => {
        const marker = L.marker([loc.latitude, loc.longitude])
          .bindPopup(loc.label)
          .on("click", () => {
            selectedLocation.value = loc;
            rental.value.locationId = loc.id;
            marker.openPopup();
          });
        markersLayer.addLayer(marker);
      });
    };

    const validateAndCreateRental = async () => {
      errorMessage.value = "";

      try {
        const userInfo = await userService.getInfoUser();
        if (!userInfo || !userInfo.id) {
          errorMessage.value = "No se pudo obtener la información del usuario. Por favor inicia sesión.";
          return;
        }
        rental.value.userId = userInfo.id;

        if (!rental.value.startDate || !rental.value.endDate) {
          errorMessage.value = "Por favor, selecciona ambas fechas.";
          return;
        }
        if (new Date(rental.value.startDate) >= new Date(rental.value.endDate)) {
          errorMessage.value = "La fecha de inicio debe ser anterior a la fecha de término.";
          return;
        }

        if (selectedLocation.value && selectedLocation.value.id) {
          rental.value.locationId = selectedLocation.value.id;
        }

        if (!rental.value.locationId) {
          errorMessage.value = "Por favor, selecciona una ubicación en el mapa.";
          return;
        }

        // Enviar con las propiedades correctas
        await rentalApiService.create({
          vehicleId: rental.value.vehicleId,
          userId: rental.value.userId,
          locationId: rental.value.locationId,
          startDate: rental.value.startDate,
          endDate: rental.value.endDate
        });

        alert("¡Renta creada con éxito!");
        router.push("/search-vehicles");

      } catch (error) {
        console.error("Error al crear la renta:", error);
        errorMessage.value = "Error al crear la renta. Intenta nuevamente.";
      }
    };

    const goBackToVehicleDetails = () => {
      const vehicleId = route.params.id;
      if (vehicleId) {
        router.push(`/vehicle/${vehicleId}`);
      } else {
        router.push("/search-vehicles");
      }
    };

    onMounted(fetchVehicleAndLocations);

    return {
      rental,
      locations,
      selectedLocation,
      errorMessage,
      validateAndCreateRental,
      goBackToVehicleDetails,
    };
  },
};
</script>

<style scoped>
/* Tus estilos originales se mantienen igual */
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

.button-group {
  display: flex;
  gap: 15px;
  width: 100%;
}

.back-btn {
  background: linear-gradient(90deg, #757575 60%, #9e9e9e 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px;
  font-size: 1.13rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;
}

.back-btn:hover {
  background: linear-gradient(90deg, #424242 60%, #616161 100%);
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
  flex: 1;
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
  .button-group {
    flex-direction: column;
  }
}
</style>
