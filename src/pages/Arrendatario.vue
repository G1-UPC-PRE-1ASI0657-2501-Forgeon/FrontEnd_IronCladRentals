<script setup>
import TheSidebarArrendatario from '@/components/elements/the-sidebarArrendatario.vue';
import TheHeaderArrendatario from '@/components/elements/the-header-arrendatario.component.vue';
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
    <!-- Header específico para arrendatarios con botón de hamburguesa -->
    <TheHeaderArrendatario @toggle-sidebar="toggleSidebar" />
    
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

.main-content {
  padding: 20px;
  padding-top: 90px; /* Espacio para el header fijo */
  min-height: 100vh;
  box-sizing: border-box;
  background: #f5f5f5;
  overflow-x: hidden;
}
</style>
