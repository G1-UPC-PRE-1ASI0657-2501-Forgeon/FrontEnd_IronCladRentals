<template>
  <header class="header">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <!-- Botón de hamburguesa para el sidebar -->
          <button 
            @click="toggleSidebar" 
            class="hamburger-button"
            aria-label="Abrir menú"
          >
            ☰
          </button>
          
          <img src="../../assets/images/logo.png" alt="Logo" class="logo">
          <h1 class="company-name">IronClad Rentals</h1>
          <span class="welcome-message">Bienvenido, {{ userName }}</span>
        </div>
      </div>
      <div class="right-section">
        <!-- Solo el botón de cerrar sesión -->
        <button @click="logout" class="button-logout" aria-label="Log out">Cerrar Sesión</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TheHeaderArrendatario',
  data() {
    return {
      userNameData: localStorage.getItem('userName') || 'Usuario'
    }
  },
  computed: {
    userName() {
      return this.userNameData;
    }
  },
  mounted() {
    // Actualizar datos cuando el componente se monta
    this.userNameData = localStorage.getItem('userName') || 'Usuario';
    console.log('🔥 TheHeaderArrendatario mounted successfully!', {
      userName: this.userNameData,
      component: 'TheHeaderArrendatario'
    });
  },
  methods: {
    logout() {
      localStorage.removeItem('rol');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      this.$router.push('/');
    },
    toggleSidebar() {
      this.$emit('toggle-sidebar');
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
  z-index: 101;
  background-color: #ffffff;
  padding: 12px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
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
  font-size: 14px;
}

.link:hover {
  color: #4a764a;
  border-bottom-color: #4a764a;
}

.link.router-link-active {
  color: #4a764a;
  border-bottom-color: #4a764a;
  font-weight: 600;
}

.button-logout {
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 14px;
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

.hamburger-button {
  background: #4a764a;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  margin-right: 15px;
  transition: all 0.2s;
}

.hamburger-button:hover {
  background: #3a5d3a;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.hamburger-button:active {
  transform: translateY(0);
}
</style>
