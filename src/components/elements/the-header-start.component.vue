<template>
  <header class="header">
    <div class="container">
      <div class="left-section">
        <div class="logo-container">
          <img src="../../assets/images/logo.png" alt="Logo" class="logo">
        </div>
      </div>
      <language-switcher aria-label="Language switcher"/>
    </div>
  </header>
</template>

<script>
import LanguageSwitcher from "@/components/elements/the-language-switcher.vue";

export default {
  name: 'TheHeader',
  components: {LanguageSwitcher},
  data() {
    return {
      companyName: 'IronClad Rentals'
    };
  },
  methods: {
    async logout() {
      try {
        await this.$router.push('/');
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
  width: 55px;
  margin-left: 30px;
}

.company-name {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.link {
  text-decoration: none;
  color: #333;
  margin-right: 20px;
  transition: color 0.3s;
}

.link:hover {
  color: #007bff;
}

.button-logout {
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.button-logout:hover {
  background-color: #bd2130;
}
</style>
