<template>
  <header class="header">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <img src="../../assets/images/logo.png" alt="Logo" class="logo">
          <h1 class="company-name">IronClad Rentals</h1>
        </div>
      </div>
      <div class="right-section">
        <!-- <router-link to="/home" class="link" aria-label="Home">Home</router-link> -->
        <router-link v-if="isArrendador" to="/landlord-vehicles" class="link" aria-label="Vehicles">Mis Vehículos</router-link>
        <router-link v-if="isArrendador" to="/edit" class="link" aria-label="Vehicles">Editar Vehículos</router-link>
        <router-link v-if="isArrendador" to="/rent-list" class="link" aria-label="Rentas">Ver Rentas</router-link>
        <router-link v-if="isArrendatario" to="/search-vehicles" class="link" aria-label="Search">Busqueda</router-link>
        <router-link v-if="isArrendatario" to="/active-rents" class="link" aria-label="Rent">Renta</router-link>
        <button @click="logout" class="button-logout" aria-label="Log out">Log out</button>
      </div>
    </div>
  </header>
</template>

<script>
import LanguageSwitcher from "@/components/elements/the-language-switcher.vue";

export default {
  name: 'TheHeaderSession',
  components: { LanguageSwitcher },
  computed: {
    isArrendador() {
      // rol: true (string) en localStorage
      return localStorage.getItem('rol') === 'true';
    },
    isArrendatario() {
      // rol: false (string) en localStorage
      return localStorage.getItem('rol') === 'false';
    },
    userName() {
      return localStorage.getItem('userName') || 'Usuario';
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('rol');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  margin-right: 10px;
}

.company-name {
  margin: 0;
  font-size: 18px;
  color: #333;
  padding-right: 30px;
}

.link {
  text-decoration: none;
  color: #333;
  margin-right: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid transparent;
  transition: border-bottom-color 0.3s;
}

.link:hover {
  color: #1a493f;
  border-bottom-color: #1a4a3f;
}

.button-logout {
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 16px;
  margin-left: 10px;
}

.button-logout:hover {
  background-color: #bd2130;
}

.welcome-message {
  color: #333;
  font-size: 16px;
  margin-left: 20px;
  font-weight: 500;
}

</style>