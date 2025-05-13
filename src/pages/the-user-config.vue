<template>
  <div class="user-config-page">
    <header>
      <TheHeaderSession />
    </header>
    <main class="content">
      <div class="user-config-container">
        <h2>Editar Usuario</h2>
        <form @submit.prevent="updateUser">
          <div class="form-grid">
            <div class="form-group">
              <label for="names">Nombres</label>
              <input v-model="user.names" type="text" id="names" required />
            </div>

            <div class="form-group">
              <label for="dni">DNI</label>
              <input v-model="user.dni" type="text" id="dni" required />
            </div>

            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input v-model="user.email" type="email" id="email" required />
            </div>

            <div class="form-group">
              <label for="phone_num">Teléfono</label>
              <input v-model="user.phone_num" type="text" id="phone_num" required />
            </div>

            <div class="form-group full-width">
              <label for="current-password">Contraseña Actual</label>
              <input v-model="currentPassword" type="password" id="current-password" required />
              <p v-if="showPasswordError" class="error-message">Por favor, ingrese la contraseña actual para cambiar los datos.</p>
            </div>
          </div>
        </form>

        <h2>Cambiar Contraseña</h2>
        <form @submit.prevent="changePassword">
          <div class="form-group full-width">
            <label for="new-password">Nueva Contraseña</label>
            <input v-model="newPassword" type="password" id="new-password" required />
          </div>
        </form>
      </div>
    </main>
    <footer>
      <TheFooter />
    </footer>
    <div class="button-container">
      <button class="action-button" @click="updateUser">Guardar Cambios</button>
      <button class="action-button" v-if="!user.rol">Adicional</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import userService from '@/shared/services/user-api.service.js';
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";

export default {
  name: "UserConfig",
  components: {
    TheHeaderSession,
    TheFooter,
  },
  setup() {
    const user = ref({
      names: '',
      dni: '',
      email: '',
      phone_num: '',
      password: '',
      rol: false,
    });

    const currentPassword = ref('');
    const newPassword = ref('');
    const showPasswordError = ref(false);

    const fetchUserData = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Usuario no encontrado.');
        return;
      }

      userService.getById(userId)
          .then((userData) => {
            user.value = userData;
          })
          .catch((error) => {
            console.error('Error al obtener los datos del usuario:', error);
          });
    };

    const updateUser = () => {
      if (!currentPassword.value) {
        showPasswordError.value = true;
        return;
      }

      showPasswordError.value = false;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Usuario no encontrado.');
        return;
      }

      const updatedUser = {
        names: user.value.names,
        dni: user.value.dni,
        email: user.value.email,
        phone_num: user.value.phone_num,
        password: currentPassword.value,
      };

      userService.update(userId, updatedUser)
          .then(() => {
            alert('¡Datos actualizados con éxito!');
            currentPassword.value = '';
          })
          .catch((error) => {
            console.error('Error al actualizar los datos:', error);
            alert('Hubo un error al actualizar los datos.');
          });
    };

    const changePassword = () => {
      if (!currentPassword.value || !newPassword.value) {
        alert('Por favor, completa ambos campos de contraseña.');
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Usuario no encontrado.');
        return;
      }

      userService.update(userId, { password: newPassword.value })
          .then(() => {
            alert('¡Contraseña actualizada con éxito!');
            currentPassword.value = '';
            newPassword.value = '';
          })
          .catch((error) => {
            console.error('Error al cambiar la contraseña:', error);
            alert('Hubo un error al cambiar la contraseña.');
          });
    };

    fetchUserData();

    return {
      user,
      currentPassword,
      newPassword,
      showPasswordError,
      updateUser,
      changePassword,
    };
  },
};
</script>

<style scoped>
.user-config-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  background-color: white; /* Añade color si no lo tiene */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  background-color: white;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  flex: 1;
  margin-top: 60px;  /* Altura del header */
  margin-bottom: 60px; /* Altura del footer */
  overflow-y: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e9f5f3, #d4e9e2);
}

.user-config-container {
  width: 100%;
  max-width: 1000px;
  padding: 30px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
  font-weight: bold;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

label {
  margin-bottom: 6px;
  font-weight: bold;
  color: #444;
  font-size: 1rem;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.error-message {
  color: red;
  font-size: 0.85rem;
  margin-top: 5px;
}

.button-container {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 150;
}

.action-button {
  padding: 12px 20px;
  background-color: #e53935; /* rojo */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.action-button:hover {
  background-color: #c62828;
  transform: scale(1.05);
}
</style>

