<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-overlay"></div>
      <h1 class="not-found-title">{{ $t('notFoundPage') }}</h1>
      <div class="not-found-actions">
        <pv-button @click="home" class="button-home">{{ $t('home') }}</pv-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThePageNotFound',
  methods: {
    async home() {
      try {
        await this.$router.push('/home');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 1250px;
  background-color: rgba(208, 232, 225, 0.54);
  overflow: hidden;
}

.not-found-content {
  position: relative;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.not-found-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: -1;
}

.not-found-title {
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #333333;
}

.not-found-actions {
  margin-top: 2rem;
}

.button-home {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #75aa9c;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-home:hover {
  background-color: #a3eddc;
}
</style>
