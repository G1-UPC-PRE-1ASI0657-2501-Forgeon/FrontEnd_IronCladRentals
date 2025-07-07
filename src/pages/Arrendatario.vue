<script setup>
import TheSidebarArrendatario from '@/components/elements/the-sidebarArrendatario.vue';
import TheHeaderArrendatario from '@/components/elements/the-header-arrendatario.component.vue';
import SupportChatBot from '@/components/elements/support-chat-bot.component.vue';
import { ref } from 'vue';

const sidebarOpen = ref(false);
const chatOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const toggleChat = () => {
  chatOpen.value = !chatOpen.value;
};

const closeChat = () => {
  chatOpen.value = false;
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

    <!-- Botón flotante de ayuda -->
    <button 
      @click="toggleChat" 
      class="support-btn"
      aria-label="Abrir chat de soporte"
    >
      <span class="support-icon">💬</span>
    </button>

    <!-- Chat de soporte -->
    <SupportChatBot 
      :visible="chatOpen"
      @close="closeChat"
    />
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

.support-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;
}

.support-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
}

.support-icon {
  font-size: 24px;
  color: white;
}
</style>
