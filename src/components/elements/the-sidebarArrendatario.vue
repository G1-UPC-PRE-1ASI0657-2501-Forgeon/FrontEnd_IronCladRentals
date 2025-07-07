<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import userService from '@/shared/services/user-api.service.js';

const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(['close']);

const userName = ref("Usuario");
const router = useRouter();

const navigate = async (path) => {
  await router.push(path);
  emit('close');
};

const checkUserRole = async () => {
  try {
    const user = await userService.getInfoUser();
    if (user) {
      userName.value = user.name || "Usuario";
    }
  } catch (error) {
    console.error("❌ Error consultando usuario:", error);
  }
};

onMounted(checkUserRole);
</script>

<template>
  <aside class="sidebar" :class="{ open: visible }">
    <div class="sidebar-header">
      <h2>Bienvenido, {{ userName }}</h2>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
    <ul class="menu">
      <li @click="navigate('/arrendatario/search-vehicles')">🔍 Buscar Vehículos</li>
      <li @click="navigate('/arrendatario/rent-list')">📑 Mis Rentas</li>
      <li @click="navigate('/arrendatario/payment-methods')">💰 Pagos</li>
      <li @click="navigate('/arrendatario/user-config')">⚙️ Configuración</li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: -260px;
  width: 250px;
  height: 100%;
  background: #4a764a;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  z-index: 2000;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  left: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 1.2rem;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
}

.menu {
  list-style: none;
  padding: 0;
  margin-top: 20px;
  flex: 1;
}

.menu li {
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.menu li:hover {
  background: #3a5d3a;
}
</style>
