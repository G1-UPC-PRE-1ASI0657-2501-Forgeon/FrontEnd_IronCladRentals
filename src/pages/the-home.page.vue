<template>
  <div>
    <header>
      <the-header-session-component/>
    </header>
    <main>
      <the-home-carousel-component/>
      <div class="welcome-message">
        <div class="overlay"></div>
        <div class="content">
          <h1 class="welcome-title" aria-label="Bienvenidos a IronClad Rentals">Bienvenidos a IronClad Rentals</h1>
          <p class="welcome-text" aria-label="Descubre nuestras soluciones innovadoras para el sector de rentas">Descubre nuestras soluciones innovadoras para el sector de rentas.</p>
          <br>
            <pv-button  class="start-button" @click="vehicle">Start</pv-button>
        </div>
      </div>
    </main>
    <footer>
      <TheFooter/>
    </footer>
  </div>
</template>

<script>
import TheHeader from "@/components/elements/the-main-header.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import theHomeCarouselComponent from "@/components/home/the-home-carousel.component.vue";
import theHeaderSessionComponent from "@/components/elements/the-header-session.component.vue";

export default {
  name: 'TheHome',
  components: {
    theHomeCarouselComponent,
    TheHeader,
    TheFooter,
    theHeaderSessionComponent
  },
  methods: {
    async vehicle() {
      try {
        await this.$router.push('/landlord-vehicles');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #ffffff;
}

main {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: -300px;
  overflow-y: auto;
  z-index: 1;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #4f4d4d;
  padding: 10px 0;
  font-size: 15px;
  line-height: 24px;
  color: #737373;
}

.welcome-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
  color: #ffffff;
  background: rgba(30, 30, 30, 0.7);
  width: 100%;
  max-width: 800px;
}



.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 254, 254, 0.5);
}

.content {
  padding: 20px;
}

.welcome-title {
  font-size: 50px; /* Tamaño más grande para el título */
  margin-bottom: 20px; /* Espacio adicional hacia abajo */
  font-weight: bold;
}

.welcome-text {
  font-size: 30px; /* Tamaño más grande para el texto */
  line-height: 1.6; /* Espaciado de línea aumentado */
  font-weight: bold;
}

.start-link {
  text-decoration: none; /* Elimina la decoración de enlace */
  display: inline-block; /* Asegura que el router-link sea un bloque */
}

.start-button {
  background-color: #fdfdfd; /* Color verde claro */
  color: #130d0d; /* Texto blanco */
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  text-align: center;
  line-height: 1; /* Ajusta el line-height para centrar verticalmente el texto */
}

.start-button:hover {
  background-color: #5d897e; /* Cambia el color al hacer hover */
}
</style>
