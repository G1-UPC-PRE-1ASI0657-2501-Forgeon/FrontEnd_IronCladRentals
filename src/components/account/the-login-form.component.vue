<template>
  <div class="login-form-container">
    <div class="login-form">
      <h2>{{ $t('login.title') }}</h2>

      <div class="form-group">
        <div class="input-label">
          <label for="email">{{ $t('login.email') }}:</label>
        </div>
        <div class="input-field">
          <input
              type="text"
              id="email"
              v-model="email"
              required
              :aria-label="$t('login.email')"
          />
        </div>
      </div>

      <div class="form-group">
        <div class="input-label">
          <label for="password">{{ $t('login.password') }}:</label>
        </div>
        <div class="input-field">
          <input
              type="password"
              id="password"
              v-model="password"
              required
              :aria-label="$t('login.enterPassword')"
          />
        </div>
      </div>

      <button @click="login" :aria-label="$t('login.login')">{{ $t('login.login') }}</button>
      <br /><br />
      <button @click="register" :aria-label="$t('login.register')">{{ $t('login.register') }}</button>
    </div>
  </div>
</template>

<script>
import userService from "@/shared/services/user-api.service.js";
import router from "@/router.js";

export default {
  name: "TheLoginForm",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const credentials = {
          email: this.email,
          password: this.password,
        };

        // 🔐 1. Iniciar sesión y guardar cookie en backend
        const loginResponse = await userService.loginUser(credentials);

        if (loginResponse.status !== 200) {
          alert("Usuario o contraseña incorrectos.");
          return;
        }

        // 🔍 2. Obtener datos del usuario autenticado desde la cookie
        const user = await userService.getInfoUser();

        if (!user) {
          alert("Sesión no válida o expirada.");
          return;
        }

        // 🚀 3. Redirigir según el rol (true = arrendador, false = arrendatario)
        if (user.role === true) {
          alert("Login exitoso como arrendador. Redirigiendo...");
          await router.push("/company-register");
        } else {
          alert("Login exitoso como arrendatario. Redirigiendo...");
          await router.push("/home");
        }

      } catch (error) {
        console.error("❌ Error en login:", error);
        alert("Ocurrió un error al iniciar sesión.");
      }
    },

    async register() {
      await router.push("/register");
    },
  },
};
</script>

<style scoped>
.login-form {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  color: #5c8677;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
    color: #5c8677;

}

.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
    color: #5c8677;

}

.input-label {
  flex: 1;
    color: #5c8677;

}

.input-field {
  flex: 3;
}

label {
  margin-bottom: 5px;
  display: block;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #75aa9c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #5c8677;
}
</style>
