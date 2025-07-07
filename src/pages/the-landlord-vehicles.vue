<template>
      <header>
      <TheHeaderSession />
    </header>
  <div class="dashboard-container">
    <div v-if="company">
      <h1>¡Bienvenido, {{ company.name }}!</h1>

      <section class="company-info">
        <h2>Tu Compañía</h2>
        <ul>
          <li><strong>Nombre:</strong> {{ company.name }}</li>
          <li><strong>RUC:</strong> {{ company.ruc }}</li>
          <li><strong>Estado:</strong> Activa</li>
          <li><strong>Registrada el:</strong> {{ formatDate(company.createdAt) }}</li>
        </ul>
      </section>

      <section class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <button @click="goToAddVehicle">➕ Registrar Vehículo</button>
          <button @click="goToVehicles">🗂️ Ver mis Vehículos</button>
          <button @click="goToReservations">📅 Ver Reservas</button>
          <button @click="goToPayments">💰 Pagos Pendientes</button>
          <button @click="goToEditCompany">✏️ Editar Compañía</button>
        </div>
      </section>

<section class="locations-section" v-if="locations">
  <h2>📍 Ubicaciones</h2>
  <ul>
    <li v-for="loc in locations" :key="loc.id">
      {{ loc.address }}, {{ loc.city }}, {{ loc.country }}
    </li>
  </ul>

  <h3>Agregar nueva ubicación</h3>
  <div class="map-container">
    <input
      v-model="searchQuery"
      placeholder="Busca dirección..."
      @keyup.enter="searchAddress"
      class="address-input"
    />

    <div id="map" class="map"></div>

    <button class="save-button" @click="saveSelectedLocation">
      💾 Guardar Ubicación Seleccionada
    </button>
  </div>
</section>



      <section v-if="summary" class="summary-card">
        <h2>📊 Resumen</h2>
        <ul>
          <li>Vehículos: {{ summary.vehicles }}</li>
          <li>Reservas activas: {{ summary.activeReservations }}</li>
          <li>Ingresos este mes: ${{ summary.monthlyIncome }}</li>
        </ul>
      </section>
    </div>

    <div v-else class="loading">
      <p>Cargando información de la compañía...</p>
    </div>
  </div>
</template>

<script>
import vehicleService from '@/shared/services/vehicle-api.service';
import L from 'leaflet';
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
export default {
  name: 'CompanyDashboard',
  components: {
    TheHeaderSession,
  },
  data() {
      return {
    company: null,
    summary: null,
    locations: [],
    searchQuery: '',
    map: null,
    marker: null,
    selectedLat: null,
    selectedLon: null,
  };
  },
  async mounted() {
    try {
      this.company = await vehicleService.getCompanyMe();
      if (!this.company) {
        this.$router.push('/company-register');
      }else {
      await this.fetchLocations();
    }

      // Opcional: podrías cargar aquí también un resumen
      // this.summary = await vehicleService.getCompanySummary(this.company.id);
    } catch (error) {
      console.error('❌ Error obteniendo la compañía:', error);
      // Opcional: redirigir o mostrar error amigable
      this.$router.push('/company-register');
    }
    await this.initMap();
  },
  methods: {
    async fetchLocations() {
    try {
      this.locations = await vehicleService.getCompanyLocations(this.company.companyId);
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    }
  },
   async initMap() {
    this.map = L.map('map').setView([-12.05, -77.03], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick);
  },

  onMapClick(e) {
    const { lat, lng } = e.latlng;
    this.setMarker(lat, lng);
  },

  setMarker(lat, lng) {
    this.selectedLat = lat;
    this.selectedLon = lng;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
      this.marker.on('dragend', this.onMarkerDrag);
    }
  },

  onMarkerDrag(e) {
    const position = e.target.getLatLng();
    this.selectedLat = position.lat;
    this.selectedLon = position.lng;
  },

  async searchAddress() {
    if (!this.searchQuery.trim()) {
      alert('Por favor, escribe una dirección.');
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}`
    );
    const data = await res.json();

    if (!data.length) {
      alert('❌ No se encontró la dirección.');
      return;
    }

    const { lat, lon } = data[0];
    this.map.setView([lat, lon], 16);
    this.setMarker(parseFloat(lat), parseFloat(lon));
  },

  async saveSelectedLocation() {
    if (!this.selectedLat || !this.selectedLon) {
      alert('Por favor, selecciona una ubicación en el mapa.');
      return;
    }

    // Opcional: hacer reverse geocoding
    const address = await this.reverseGeocode(this.selectedLat, this.selectedLon);

    const locationData = {
      address: address.display_name || 'Dirección sin nombre',
      city: this.extractCity(address) || '',
      country: this.extractCountry(address) || '',
      latitude: this.selectedLat,
      longitude: this.selectedLon,
      companyId: this.company.id,
      locationStatus: 'Activo'
    };

    await vehicleService.createLocation(locationData);
    alert('✅ Ubicación guardada con éxito!');
    await this.fetchLocations();
  },

  async reverseGeocode(lat, lon) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    return await res.json();
  },

  extractCity(place) {
    if (place && place.address) {
      return place.address.city || place.address.town || place.address.village || '';
    }
    return '';
  },

  extractCountry(place) {
    if (place && place.address) {
      return place.address.country || '';
    }
    return '';
  },

    goToAddVehicle() {
      this.$router.push('/vehicles/create');
    },
      formatDate(dateStr) {
    if (!dateStr) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
  },
    goToVehicles() {
      this.$router.push('/vehicles');
    },
    goToReservations() {
      this.$router.push('/reservations');
    },
    goToPayments() {
      this.$router.push('/payments');
    },
    goToEditCompany() {
      this.$router.push('/company/edit');
    }
  }
};
</script>
<style>

body {
  background-color: #e9f5f3;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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



.dashboard-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.map-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.map {
  height: 300px;
  width: 100%;
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
  z-index: 1;
}

.address-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}

.save-button {
  padding: 10px 16px;
  background-color: #1a4a3f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  align-self: flex-start;
}

.save-button:hover {
  background-color: #145c4f;
}


h1 {
  text-align: center;
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.company-card, .summary-card, .actions-section {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.company-card h2,
.actions-section h2,
.summary-card h2 {
  margin-bottom: 12px;
  color: #1a4a3f;
  font-size: 20px;
  border-bottom: 2px solid #d4e9e2;
  padding-bottom: 6px;
}

.locations-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.locations-section ul {
  list-style: none;
  padding: 0;
}

.locations-section li {
  margin-bottom: 8px;
}

.new-location-form {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.new-location-form input {
  flex: 1 1 150px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.new-location-form button {
  padding: 8px 16px;
  background-color: #1a4a3f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}


.company-card ul,
.summary-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.company-card li,
.summary-card li {
  margin: 8px 0;
  font-size: 16px;
}

.actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.actions-grid button {
  flex: 1 1 40%;
  min-width: 140px;
  padding: 12px;
  background-color: #1a4a3f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.actions-grid button:hover {
  background-color: #145c4f;
}

@media (max-width: 600px) {
  .actions-grid {
    flex-direction: column;
  }

  .actions-grid button {
    flex: 1 1 100%;
  }
}
</style>