<template>
  <div class="user-config-page">
    <header>
      <TheHeaderSession />
    </header>

    <main class="content">
      <div class="user-config-container">
        <div class="icon-container" @mouseenter="iconHover = true" @mouseleave="iconHover = false">
          <i class="fas fa-user-circle" :class="{ 'icon-hover': iconHover }"></i>
        </div>

        <section class="section-block fade-in">
          <h2 class="animated-title">Editar Usuario</h2>
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
                <p v-if="showPasswordError" class="error-message shake">
                  Por favor, ingrese la contraseña actual para cambiar los datos.
                </p>
              </div>
            </div>

            <div class="button-group">
              <button class="action-button primary bounce" type="submit">Guardar Cambios</button>
              <button class="action-button secondary" v-if="!user.rol" type="button">Adicional</button>
            </div>
          </form>
        </section>

        <section class="section-block fade-in delay">
          <h2 class="animated-title">Cambiar Contraseña</h2>
          <form @submit.prevent="changePassword">
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="new-password">Nueva Contraseña</label>
                <input v-model="newPassword" type="password" id="new-password" required />
              </div>
            </div>
            <div class="button-group">
              <button class="action-button primary bounce" type="submit">Cambiar Contraseña</button>
            </div>
          </form>
        </section>
      </div>
    </main>

    <footer>
      <TheFooter />
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue';
import userService from '@/shared/services/user-api.service.js';
import TheHeaderSession from '@/components/elements/the-header-session.component.vue';
import TheFooter from '@/components/elements/the-footer.component.vue';

export default {
  name: 'UserConfig',
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
    const iconHover = ref(false);

    const fetchUserData = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Usuario no encontrado.');
        return;
      }

      userService
          .getById(userId)
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

      userService
          .update(userId, updatedUser)
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

      userService
          .update(userId, { password: newPassword.value })
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
      iconHover,
    };
  },
};
</script>

<style scoped>
.user-config-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #e9f5f3, #d4e9e2);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  overflow: visible;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

footer {
  background-color: #4f4d4d;
  padding: 10px 0;
  font-size: 14px;
  color: #737373;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.content {
  position: absolute;
  top: 58px;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
  overflow-y: auto;
}

.user-config-container {
  width: 100%;
  max-width: 550px;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.4s ease-out;
  position: relative;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    transform: translateY(25px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.icon-container {
  text-align: center;
  margin-bottom: 16px;
  cursor: pointer;
  display: inline-block;
  perspective: 600px;
}

.icon-container i {
  font-size: 3rem;
  color: #1976d2;
  animation: pulse 1.5s infinite ease-in-out;
  transition: transform 0.3s ease, color 0.3s ease;
  display: inline-block;
}

.icon-container i.icon-hover {
  animation: none;
  color: #0d47a1;
  transform: rotateY(360deg) scale(1.2);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
}

.section-block {
  margin-bottom: 24px;
  opacity: 0;
  animation-fill-mode: forwards;
}

.fade-in {
  animation: fadeIn 0.6s ease-in-out forwards;
}

.fade-in.delay {
  animation-delay: 0.3s;
}

h2 {
  text-align: center;
  margin-bottom: 12px;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.animated-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 0;
  height: 3px;
  background: #1976d2;
  transition: width 0.4s ease, left 0.4s ease;
  border-radius: 2px;
}

.animated-title:hover::after {
  width: 60%;
  left: 20%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

label {
  margin-bottom: 3px;
  font-weight: 500;
  color: #444;
  font-size: 0.85rem;
  user-select: none;
}

input {
  padding: 6px 9px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #f9fafd;
  outline-offset: 2px;
}

input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 6px rgba(25, 118, 210, 0.5);
  outline: none;
  background-color: #fff;
}

.error-message {
  color: red;
  font-size: 0.78rem;
  margin-top: 2px;
  font-weight: 600;
}

/* Shake animation for errors */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.shake {
  animation: shake 0.5s;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}

.action-button {
  padding: 7px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  user-select: none;
  position: relative;
  overflow: hidden;
}

.action-button.primary {
  background-color: #28a745;
  color: white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.5);
}

.action-button.primary:hover {
  background-color: #218838;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(33, 136, 56, 0.7);
  z-index: 2;
}

.action-button.secondary {
  background-color: #f0f0f0;
  color: #444;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.action-button.secondary:hover {
  background-color: #d6d6d6;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  z-index: 2;
}

/* Bounce animation for buttons */
@keyframes bounce {
  0%, 60% {
    transform: translateY(0);
  }

}

.bounce {
  animation: bounce 9s infinite;
}

/* Fade in animation */
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
