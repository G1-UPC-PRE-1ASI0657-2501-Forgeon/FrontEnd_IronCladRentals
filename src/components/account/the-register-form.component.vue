<template>
  <div class="registration-form-container" role="form" aria-label="Formulario de registro">
    <div class="registration-form">
      <h2>Registro</h2>

      <div class="form-group">
        <div class="input-label">
          <label for="names">Nombre completo:</label>
        </div>
        <div class="input-field">
          <pv-input-text type="text" id="names" v-model="name" required aria-label="Ingrese su nombre completo" />
        </div>
      </div>

      <div class="form-group">
        <div class="input-label">
          <label for="dni">DNI:</label>
        </div>
        <div class="input-field">
          <pv-input-text type="text" id="dni" v-model="dni" required aria-label="Ingrese su DNI" />
        </div>
      </div>

      <div class="form-group">
        <div class="input-label">
          <label for="email">Correo electrónico:</label>
        </div>
        <div class="input-field">
          <pv-input-text type="email" id="email" v-model="email" required aria-label="Ingrese su correo electrónico" />
        </div>
      </div>

      <div class="form-group">
        <div class="input-label">
          <label for="phone">Teléfono:</label>
        </div>
        <div class="input-field">
          <pv-input-text type="tel" id="phone" v-model="phone" required aria-label="Ingrese su número de teléfono" />
        </div>
      </div>

      <div class="form-group">
        <div class="input-label">
          <label for="rol">Rol:</label>
        </div>
        <div class="input-field">
          <select id="rol" v-model="rol" required aria-label="Seleccione su rol">
            <option disabled value="">Seleccionar rol</option>
            <option :value="true">Arrendador</option>
            <option :value="false">Arrendatario</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <div class="input-label">
          <label for="password">Contraseña:</label>
        </div>
        <div class="input-field">
          <input type="password" id="password" v-model="password" required aria-label="Ingrese su contraseña" />
        </div>
      </div>

      <div class="form-group">
        <div class="input-label">
          <label for="confirmPassword">Confirmar Contraseña:</label>
        </div>
        <div class="input-field">
          <input type="password" id="confirmPassword" v-model="confirmPassword" required aria-label="Confirme su contraseña" />
        </div>
      </div>

      <button @click="register" aria-label="Registrar">Registrar</button>
    </div>
  </div>
</template>

<script>
import userService from "@/shared/services/user-api.service.js";
import router from "@/router.js";

export default {
  name: "TheRegisterForm",
  data() {
    return {
      name: "",
      dni: "",
      email: "",
      phone: "",
      rol: "", // será booleano gracias a :value en el select
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async register() {
      if (!this.name || !this.dni || !this.email || !this.phone || this.rol === "" || !this.password || !this.confirmPassword) {
        alert("Por favor complete todos los campos.");
        return;
      }

      if (this.password !== this.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      const body = {
        email: this.email,
        password: this.password,
        name: this.name,
        dni: this.dni,
        phone: this.phone,
        role: this.rol, // ahora es booleano
      };

      console.log("Datos a registrar:", body); // Para debug

      try {
        const response = await userService.create(body);
        console.log("Respuesta de la API:", response);
        if (response) {
          alert("Usuario registrado exitosamente");
          await router.push("/login");
        } else {
          alert("Hubo un error en el registro.");
        }
      } catch (error) {
        console.error("Error al registrar el usuario:", error.response ? error.response.data : error.message);
        alert("Hubo un problema al registrar el usuario. Por favor, intente nuevamente.");
      }
    },
  },
};
</script>

<style scoped>
.registration-form {
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
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
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
input[type="email"],
input[type="tel"],
input[type="password"],
select {
  width: 100%;
  padding: 15px;
  border: none;
  border-bottom: 1px solid #757575;
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
