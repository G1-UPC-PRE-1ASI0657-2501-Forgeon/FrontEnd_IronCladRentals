<template>
  <header class="header" role="banner">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <img src="../../assets/images/logo.png" alt="Logo" class="logo">
          <h1 class="company-name">{{ companyName }}</h1>
          <language-switcher aria-label="Language switcher"/>
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
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background-color: #75aa9c;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.button-login:hover,
.button-register:hover {
  background-color: #0056b3;
}
</style>
