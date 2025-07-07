<script setup>
import TheSidebarArrendatario from '@/components/elements/the-sidebarArrendatario.vue';
import { ref } from 'vue';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};
</script>

<template>
  <div class="layout">
    <!-- Botón de menú SOLO visible si sidebar está cerrado -->
    <button
      v-if="!sidebarOpen"
      class="menu-button"
      @click="toggleSidebar"
    >
      ☰ Menú
    </button>

    <!-- Sidebar -->
    <TheSidebarArrendatario
      :visible="sidebarOpen"
      @close="closeSidebar"
    />

    <!-- Contenido principal -->
    <div class="main-content">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
.layout {
  position: relative;
  min-height: 100vh;
}

/* Botón de menú */
.menu-button {
  position: fixed;
  top: 100px;
  left: 20px;
  z-index: 2001;
  background: #4a764a;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: background 0.2s;
}

.menu-button:hover {
  background: #3a5d3a;
}

.main-content {
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
  background: #f5f5f5;
  overflow-x: hidden;
}
</style>
