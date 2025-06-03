<template>
  <div class="rent-creation">
    <TheHeaderSession />
    <div class="content">
      <h1 class="title">Crear Renta</h1>

      <div class="form-container">
        <div class="form-group">
          <label>Fecha de inicio:</label>
          <Calendar v-model="rental.start_date" dateFormat="yy-mm-dd" showIcon />
        </div>

        <div class="form-group">
          <label>Fecha de término:</label>
          <Calendar v-model="rental.end_date" dateFormat="yy-mm-dd" showIcon />
        </div>

        <div class="form-group">
          <label>Ubicación de entrega:</label>
          <Dropdown
              v-model="rental.location_id"
              :options="locations"
              optionLabel="label"
              optionValue="id"
              placeholder="Selecciona una ubicación"
              class="w-full"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <Button
            label="Confirmar Renta"
            class="p-button-success mt-4 w-full"
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
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";

import rentalApiService from "@/shared/services/rental-api.service.js";
import locationApiService from "@/shared/services/location-api.service.js";

export default {
  components: {
    Calendar,
    Dropdown,
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
    const errorMessage = ref("");

    const fetchLocations = async () => {
      try {
        const res = await locationApiService.getAll();
        locations.value = res.data
            .filter((loc) => loc.location_status === "active")
            .map((loc) => ({
              id: loc.id,
              label: `${loc.city} - ${loc.address} (${loc.latitude}, ${loc.longitude})`,
            }));
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
      }
    };

    const validateAndCreateRental = async () => {
      // Validar y asignar vehicle_id desde la URL
      const vehicleId = route.params.id;
      if (!vehicleId) {
        errorMessage.value = "No se encontró el ID del vehículo en la URL.";
        return;
      }
      rental.value.vehicle_id = vehicleId;

      // Validar y asignar user_id desde localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        errorMessage.value = "No se encontró el ID del usuario en el localStorage.";
        return;
      }
      rental.value.user_id = userId;

      // Validar fechas
      if (!rental.value.start_date || !rental.value.end_date) {
        errorMessage.value = "Por favor, selecciona ambas fechas.";
        return;
      }

      if (new Date(rental.value.start_date) >= new Date(rental.value.end_date)) {
        errorMessage.value = "La fecha de inicio debe ser anterior a la fecha de término.";
        return;
      }

      // Validar ubicación
      if (!rental.value.location_id) {
        errorMessage.value = "Por favor, selecciona una ubicación.";
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
      errorMessage,
      validateAndCreateRental,
    };
  },
};
</script>

<style scoped>
.rent-creation {
  background: linear-gradient(to right, #c8e6c9, #a5d6a7);
  min-height: 100vh;
  padding-top: 80px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

}

.title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #2e7d32;
}

.form-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);

}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #d32f2f;
  font-weight: bold;
  margin-top: 1rem;
  text-align: center;
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
  color: #737373;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>