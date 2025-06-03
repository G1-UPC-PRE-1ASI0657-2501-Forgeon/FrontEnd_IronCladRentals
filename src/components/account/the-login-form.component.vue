<template>
  <div class="login-form-container">
    <div class="login-form">
      <h2>{{ $t('login.title') }}</h2>

      <div class="form-group">
        <div class="input-label">
          <label for="full_name">{{ $t('login.full_name') }}:</label>
        </div>
        <div class="input-field">
          <input
              type="text"
              id="full_name"
              v-model="full_name"
              required
              :aria-label="$t('login.full_name')"
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
      full_name: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const users = await userService.getAll();
        const user = users.find((u) => u.names === this.full_name);

        if (!user) {
          alert("Usuario no encontrado");
          return;
        }

        if (user.password === this.password) {
          localStorage.setItem("rol", String(user.rol));
          localStorage.setItem("userId", user.id);
          localStorage.setItem("userName", user.names);

          const userCompanyMap = JSON.parse(localStorage.getItem("userCompanyMap") || "{}");
          const companyId = userCompanyMap[user.id];

          if (user.rol === true) {
            // Usuario es arrendador
            if (companyId) {
              localStorage.setItem("companyId", companyId);
              alert("Login exitoso. Redirigiendo a tu panel.");
              await router.push("/landlord-vehicles");
            } else {
              alert("Login exitoso. Completa el registro de tu compañía.");
              await router.push("/company-register");
            }
          } else {
            // Usuario es arrendatario
            alert("Login exitoso. Redirigiendo a tu panel.");
            await router.push("/search-vehicles");
          }
        } else {
          alert("Contraseña incorrecta");
        }
      } catch (error) {
        console.error("Error en login:", error);
        alert("Ocurrió un error al iniciar sesión");
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
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.input-label {
  flex: 1;
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
