<template>
  <div class="login-form-container" role="form" aria-label="Formulario de login">
    <div class="login-form">
      <h2>{{ $t('login.title') }}</h2>

      <div class="form-group">
        <div class="input-label">
          <label for="email">{{ $t('login.email') }}</label>
        </div>
        <div class="input-field">
          <input
              type="text"
              id="email"
              v-model="email"
              required
              :aria-label="$t('login.email')"
              placeholder="Ingrese su email"
          />
        </div>
      </div>

      <div class="form-group">
        <div class="input-label">
          <label for="password">{{ $t('login.password') }}</label>
        </div>
        <div class="input-field">
          <input
              type="password"
              id="password"
              v-model="password"
              required
              :aria-label="$t('login.enterPassword')"
              placeholder="Ingrese su contraseña"
          />
        </div>
      </div>

      <button @click="login" :aria-label="$t('login.login')">{{ $t('login.login') }}</button>
      <button @click="register" :aria-label="$t('login.register')" class="button-secondary">{{ $t('login.register') }}</button>
    </div>
  </div>
</template>

<script>
import userService from "@/shared/services/user-api.service.js";
import router from "@/router.js";
import vehicleService from "@/shared/services/vehicle-api.service";
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
    // 🔐 Primero haces login (esto guarda el token en la cookie)
    await userService.login(this.email, this.password);

    // 👤 Luego obtienes los datos del usuario desde el backend
    const user = await userService.getInfoUser();

    if (!user) {
      alert("No se pudo obtener información del usuario");
      return;
    }

    const userCompanyMap = JSON.parse(localStorage.getItem("userCompanyMap") || "{}");
    const companyId = userCompanyMap[user.id];

    if (user.role === true || user.role === "True") {
      // Usuario arrendador
      if (vehicleService.getCompanyMe()) {
        alert("Login exitoso. Redirigiendo a tu panel.");
        await router.push("/landlord-vehicles");
      } else {
        alert("Login exitoso. Completa el registro de tu compañía.");
        await router.push("/company-register");
      }
    } else {
      // Usuario arrendatario
      alert("Login exitoso. Redirigiendo a tu panel.");
await router.push('/arrendatario/search-vehicles');
    }

  } catch (error) {
    console.error("Error en login:", error);
    alert("Ocurrió un error al iniciar sesión");
  }
}
,

    async register() {
      await router.push("/register");
    },
  },
};
</script>

<style scoped>
.login-form-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #333;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 2.2em;
  font-weight: 600;
  background: linear-gradient(45deg, #75aa9c, #5a9e8e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-group {
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
}

.input-label {
  margin-bottom: 8px;
}

.input-field {
  position: relative;
}

label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e8ecef;
  border-radius: 12px;
  outline: none;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: #a0a0a0;
  font-style: italic;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #75aa9c;
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(117, 170, 156, 0.15);
}

button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(45deg, #75aa9c, #5a9e8e);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

button:hover {
  background: linear-gradient(45deg, #5a9e8e, #377a6a);
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(117, 170, 156, 0.3);
}

button:active {
  transform: translateY(0);
}

.button-secondary {
  background: transparent !important;
  color: #75aa9c !important;
  border: 2px solid #75aa9c !important;
}

.button-secondary:hover {
  background: rgba(117, 170, 156, 0.1) !important;
  color: #5a9e8e !important;
  border-color: #5a9e8e !important;
  box-shadow: 0 8px 20px rgba(117, 170, 156, 0.2) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-form {
    padding: 30px 25px;
    max-width: 100%;
  }
  
  h2 {
    font-size: 1.8em;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 25px 20px;
  }
  
  h2 {
    font-size: 1.6em;
    margin-bottom: 25px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  input[type="text"],
  input[type="password"] {
    padding: 12px 16px;
    font-size: 15px;
  }
  
  button {
    padding: 14px;
    font-size: 15px;
  }
}
</style>
