<template>
  <div class="registration-form-container" role="form" aria-label="Formulario de registro">
    <div class="registration-form">
      <h2>Registro</h2>      <div class="form-group">
      <div class="form-group">
        <div class="input-field">
          <pv-input-text type="email" id="email" v-model="email" required aria-label="Ingrese su correo electrónico" placeholder="Correo electrónico" />
        </div>
      </div> 
       <div class="form-group">
        <div class="input-field">
          <input type="password" id="password" v-model="password" required aria-label="Ingrese su contraseña" placeholder="Contraseña" />
        </div>
      </div>  
        <div class="input-field">
          <pv-input-text type="text" id="name" v-model="name" required aria-label="Ingrese su nombre completo" placeholder="Nombre completo" />
        </div>
      </div>      
      <div class="form-group">
        <div class="input-field">
          <pv-input-text type="text" id="dni" v-model="dni" required aria-label="Ingrese su DNI" placeholder="DNI" />
        </div>
      </div>      
       
      <div class="form-group">
        <div class="input-field">
          <pv-input-text type="tel" id="phone" v-model="phone" required aria-label="Ingrese su número de teléfono" placeholder="Teléfono" />
        </div>
      </div>     
       <div class="form-group">
        <div class="input-field">
          <select
  id="role"
  v-model="role"
  required
  aria-label="Seleccione su rol"
>
  <option value="">Seleccionar rol</option>
  <option :value="true">Arrendador</option>
  <option :value="false">Arrendatario</option>
</select>


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
      role: "",      password: "",
    };
  },
  methods: {
    async register() {
      const body = {
        email: this.email,
        password: this.password,
        name: this.name,
        dni: this.dni,
        phone: this.phone,
        role: this.role, // Convertir a booleano
      };

      console.log("Datos a registrar:", body); // Verificar los datos enviados

     try {
  const response = await userService.register(body);
  alert("Usuario registrado exitosamente");
  await router.push("/login");
} catch (error) {
  console.error("Error al registrar:", error);
  alert("Hubo un error al registrar el usuario.");
}
    },
  },
};
</script>

<style scoped>
.registration-form-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.registration-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 20px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #333;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.9em;
  font-weight: 600;
  background: linear-gradient(45deg, #75aa9c, #5a9e8e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.input-field {
  position: relative;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"],
select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8ecef;
  border-radius: 12px;
  outline: none;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input[type="text"]::placeholder,
input[type="email"]::placeholder,
input[type="tel"]::placeholder,
input[type="password"]::placeholder {
  color: #a0a0a0;
  font-style: italic;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
input[type="password"]:focus,
select:focus {
  border-color: #75aa9c;
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(117, 170, 156, 0.15);
}

select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  appearance: none;
}

button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #75aa9c, #5a9e8e);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  margin-top: 8px;
}

button:hover {
  background: linear-gradient(45deg, #5a9e8e, #377a6a);
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(117, 170, 156, 0.3);
}

button:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .registration-form {
    padding: 20px;
    max-width: 100%;
  }
  
  h2 {
    font-size: 1.7em;
    margin-bottom: 15px;
  }
  
  .form-group {
    margin-bottom: 13px;
  }
}

@media (max-width: 480px) {
  .registration-form {
    padding: 18px 16px;
  }
  
  h2 {
    font-size: 1.5em;
    margin-bottom: 12px;
  }
  
  .form-group {
    margin-bottom: 12px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  select {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  button {
    padding: 12px;
    font-size: 14px;
  }
}
</style>
