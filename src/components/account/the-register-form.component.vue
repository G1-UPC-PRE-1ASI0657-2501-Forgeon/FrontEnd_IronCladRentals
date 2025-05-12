<template>
  <div class="registration-form-container" role="form" aria-label="Formulario de registro">
    <div class="registration-form">
      <h2>Registro</h2>

      <div class="form-group">
        <div class="input-label">
          <label for="names">Nombre completo:</label>
        </div>
        <div class="input-field">
          <pv-input-text type="text" id="names" v-model="names" required aria-label="Ingrese su nombre completo" />
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
            <option value="">Seleccionar rol</option>
            <option value="true">Arrendador</option>
            <option value="false">Arrendatario</option>
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
      names: "",
      dni: "",
      email: "",
      phone: "",
      rol: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async register() {
      const body = {
        names: this.names,
        dni: this.dni,
        email: this.email,
        phone_num: this.phone,
        rol: this.rol === "true", // Convertir a booleano
        password: this.password,
      };

      console.log("Datos a registrar:", body); // Verificar los datos enviados

      try {
        const response = await userService.create(body);
        console.log("Respuesta de la API:", response); // Verificar la respuesta de la API

        // Verificar si la respuesta tiene un id (esto indica que el usuario fue creado)
        if (response && response.id) {
          alert("Usuario registrado exitosamente");
          await router.push("/login");
        } else {
          console.error("Error al registrar el usuario: Respuesta no contiene ID");
          alert("Hubo un error en el registro.");
        }
      } catch (error) {
        // Aquí registramos el error de forma detallada
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
input[type="email"],
input[type="tel"],
input[type="password"],
select {
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
