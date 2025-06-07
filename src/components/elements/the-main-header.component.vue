<template>
  <header class="header" role="banner">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <img src="../../assets/images/logo.png" alt="Logo" class="logo">
          <h1 class="company-name">{{ companyName }}</h1>
        </div>
      </div>
      <div class="right-section">
        <pv-button @click="login" class="button-login" aria-label="Iniciar sesión">Login </pv-button>
        <pv-button @click="register" class="button-register" aria-label="Registrarse">Register</pv-button>
      </div>
    </div>
  </header>
</template>

<script>
import LanguageSwitcher from "@/components/elements/the-language-switcher.vue";

export default {
  name: 'Header',
  components: {LanguageSwitcher},
  data() {
    return {
      companyName: 'IronClad Rentals'
    };
  },
  methods: {
    async login() {
      try {
        await this.$router.push('/login');
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async register() {
      try {
        await this.$router.push('/register');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #ffffff;
  padding: 12px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  height: 60px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  padding-right: 50px;
}

.button-login,
.button-register {
  background-color: #377a6a;
  color: #ffffff;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-login {
  background-color: transparent;
  color: #377a6a;
  border: 1px solid #377a6a;
}

.button-login:hover {
  background-color: rgba(55, 122, 106, 0.1);
}

.button-register:hover {
  background-color: #2a5c4f;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
