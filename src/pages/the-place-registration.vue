<script setup>
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locationApiService from "@/shared/services/location-api.service.js";
import Button from "primevue/button";
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";

const location = ref({
  address: "",
  latitude: null,
  longitude: null,
  location_status: "active",
  company_id: null,
});
const locations = ref([]);
const editingLocation = ref(null);
const errorMessage = ref("");
const successMessage = ref("");
const marker = ref(null);
const map = ref(null);

const getCompanyId = () => localStorage.getItem("companyId");

const fetchLocations = async () => {
  const companyId = getCompanyId();
  if (!companyId) return;
  const res = await locationApiService.getAll();
  locations.value = res.data.filter(l => l.company_id == companyId);
};

const initMap = () => {
  const defaultLat = -12.0464;
  const defaultLng = -77.0428;
  map.value = L.map("map").setView([defaultLat, defaultLng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map.value);
};

const searchAddress = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  const addr = editingLocation.value ? editingLocation.value.address : location.value.address;
  if (!addr) {
    errorMessage.value = "Ingresa la dirección completa.";
    return;
  }
  try {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      if (editingLocation.value) {
        editingLocation.value.latitude = lat;
        editingLocation.value.longitude = lon;
      } else {
        location.value.latitude = lat;
        location.value.longitude = lon;
      }
      map.value.setView([lat, lon], 16);
      if (marker.value) {
        marker.value.setLatLng([lat, lon]);
      } else {
        marker.value = L.marker([lat, lon]).addTo(map.value);
      }
    } else {
      errorMessage.value = "No se encontró la dirección.";
    }
  } catch (e) {
    errorMessage.value = "Error al buscar la dirección.";
  }
};

const createLocation = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  if (!location.value.address) {
    errorMessage.value = "Completa la dirección.";
    return;
  }
  if (!location.value.latitude || !location.value.longitude) {
    errorMessage.value = "Busca la dirección en el mapa primero.";
    return;
  }
  const companyId = getCompanyId();
  if (!companyId) {
    errorMessage.value = "No se encontró el companyId del usuario.";
    return;
  }
  location.value.company_id = companyId;
  try {
    await locationApiService.create(location.value);
    successMessage.value = "¡Lugar registrado con éxito!";
    await fetchLocations();
    location.value = { address: "", latitude: null, longitude: null, location_status: "active", company_id: null };
    if (marker.value) marker.value.remove();
    marker.value = null;
  } catch (e) {
    errorMessage.value = "Error al registrar el lugar.";
  }
};

const deleteLocation = async (id) => {
  try {
    await locationApiService.delete(id);
    await fetchLocations();
    successMessage.value = "Lugar eliminado.";
  } catch (e) {
    errorMessage.value = "Error al eliminar el lugar.";
  }
};

const startEdit = (loc) => {
  editingLocation.value = { ...loc };
  if (loc.latitude && loc.longitude) {
    map.value.setView([loc.latitude, loc.longitude], 16);
    if (marker.value) {
      marker.value.setLatLng([loc.latitude, loc.longitude]);
    } else {
      marker.value = L.marker([loc.latitude, loc.longitude]).addTo(map.value);
    }
  }
};

const cancelEdit = () => {
  editingLocation.value = null;
  errorMessage.value = "";
  successMessage.value = "";
  if (marker.value) marker.value.remove();
  marker.value = null;
};

const saveEdit = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  if (!editingLocation.value.address) {
    errorMessage.value = "Completa la dirección.";
    return;
  }
  if (!editingLocation.value.latitude || !editingLocation.value.longitude) {
    errorMessage.value = "Busca la dirección en el mapa primero.";
    return;
  }
  try {
    await locationApiService.update(editingLocation.value.id, editingLocation.value);
    successMessage.value = "Lugar actualizado.";
    editingLocation.value = null;
    await fetchLocations();
    if (marker.value) marker.value.remove();
    marker.value = null;
  } catch (e) {
    errorMessage.value = "Error al actualizar el lugar.";
  }
};

onMounted(async () => {
  initMap();
  await fetchLocations();
});
</script>

<template>
  <div class="place-registration">
    <header>
      <TheHeaderSession />
    </header>
    <div class="content">
      <h1 class="title">Registrar Lugar de Recogida</h1>
      <div class="main-layout">
        <!-- Formulario de registro o edición -->
        <div class="form-container">
          <template v-if="editingLocation">
            <div class="form-group">
              <label>Dirección completa</label>
              <input v-model="editingLocation.address" type="text" class="input" />
            </div>
            <Button label="Buscar en el mapa" class="search-btn" @click="searchAddress" />
            <div id="map" class="map"></div>
            <p v-if="editingLocation.latitude && editingLocation.longitude" class="selected-location">
              Coordenadas: {{ editingLocation.latitude }}, {{ editingLocation.longitude }}
            </p>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            <div class="edit-actions">
              <Button label="Guardar" class="submit-btn" @click="saveEdit" />
              <Button label="Cancelar" class="cancel-btn" @click="cancelEdit" />
            </div>
          </template>
          <template v-else>
            <div class="form-group">
              <label>Dirección completa (ej: La Molina, Alameda del Corregidor 1665, Lima, Perú)</label>
              <input v-model="location.address" type="text" class="input" />
            </div>
            <Button label="Buscar en el mapa" class="search-btn" @click="searchAddress" />
            <div id="map" class="map"></div>
            <p v-if="location.latitude && location.longitude" class="selected-location">
              Coordenadas: {{ location.latitude }}, {{ location.longitude }}
            </p>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            <Button label="Registrar Lugar" class="submit-btn" @click="createLocation" />
          </template>
        </div>
        <!-- Lista de ubicaciones -->
        <div class="locations-list">
          <h2 class="list-title">Lugares registrados</h2>
          <div v-if="locations.length === 0" class="empty-list">No hay lugares registrados.</div>
          <ul>
            <li v-for="loc in locations" :key="loc.id" class="location-item">
              <div>
                <span class="address">{{ loc.address }}</span>
                <span class="coords">({{ loc.latitude }}, {{ loc.longitude }})</span>
              </div>
              <div class="actions">
                <button class="icon-btn" @click="startEdit(loc)" title="Editar">✏️</button>
                <button class="icon-btn" @click="deleteLocation(loc.id)" title="Eliminar">❌</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <footer>
      <TheFooter />
    </footer>
  </div>
</template>

<style scoped>
.place-registration {
  background: linear-gradient(135deg, #e9f5f3, #b2d8b2);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  margin: 0 auto;
  padding: 40px 20px;
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1; /* Permite que el contenido crezca y empuje el footer hacia abajo */
}

.title {
  text-align: center;
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #2e7d32;
}

.main-layout {
  display: flex;
  flex-direction: row;
  gap: 40px;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
}

.form-container {
  background-color: #fff;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(50, 100, 50, 0.13);
  width: 65%;
  min-width: 350px;
  max-width: 700px;
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

.input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1.5px solid #b2d8b2;
  font-size: 1em;
}

.map {
  width: 100%;
  height: 240px;
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

.submit-btn, .search-btn, .cancel-btn {
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
  margin-bottom: 10px;
}

.cancel-btn {
  background: #d32f2f;
  margin-top: 0;
}

.submit-btn:hover, .search-btn:hover {
  background: linear-gradient(90deg, #1b5e20 60%, #388e3c 100%);
}

.cancel-btn:hover {
  background: #b71c1c;
}

.edit-actions {
  display: flex;
  gap: 10px;
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

.success-message {
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
  font-size: 1.02em;
  border-radius: 6px;
  background: #eaffea;
  padding: 7px;
}

.locations-list {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(50, 100, 50, 0.13);
  padding: 1.5rem;
  width: 30%;
  min-width: 250px;
  max-width: 350px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 10px;
}

.empty-list {
  color: #888;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid #e0e0e0;
}

.address {
  font-weight: 500;
  color: #1b4332;
}

.coords {
  font-size: 0.95em;
  color: #388e3c;
  margin-left: 8px;
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 2px 6px;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: #e0f2f1;
  border-radius: 5px;
}

@media (max-width: 1100px) {
  .main-layout {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  .form-container, .locations-list {
    width: 100%;
    max-width: 100%;
  }
}


footer {
  background-color: #496b49;
  padding: 18px 0 16px 0;
  font-size: 14px;
  line-height: 22px;
  color: #e0f2e0;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  box-shadow: 0 -4px 10px rgba(53, 102, 53, 0.3);
}

header {
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
</style>
