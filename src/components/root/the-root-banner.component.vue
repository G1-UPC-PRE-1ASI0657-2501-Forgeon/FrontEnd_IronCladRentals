<template>
  <div class="banner" role="banner" aria-label="Banner">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 left-section">
          <h1 class="headline">Descubre IronClad Rentals</h1>
          <p class="description">
            La plataforma innovadora para el alquiler de vehículos. Gestiona, reserva y administra tu flota de manera sencilla y eficiente, ya seas propietario o arrendatario.
          </p>
          <ul class="features list-unstyled" role="list" aria-label="Features">
            <li role="listitem">Encuentra y reserva vehículos fácilmente desde cualquier lugar.</li>
            <li role="listitem">Administra tu flota, disponibilidad y precios en tiempo real.</li>
            <li role="listitem">Soluciones seguras y flexibles para propietarios y clientes.</li>
          </ul>
        </div>
        <div class="col-lg-6 right-section">
          <img src="https://web.didiglobal.com/_next/image/?url=https%3A%2F%2Fimages.ctfassets.net%2Fn7hs0hadu6ro%2F7IkskYV6vMBg2ZFxScYJkb%2Fd8011925ab92e9c9a8330ee227534aa4%2FiStock-1597373319.jpg&w=3840&q=75" alt="Imagen de vehículo en alquiler" class="hero-image" role="img" aria-label="Imagen de vehículo en alquiler">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'the-home-banner',
}
</script>

<style scoped>
.banner {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 50px 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 1140px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.col-lg-6 {
  flex: 1;
}

.left-section, .right-section {
  padding: 0 20px;
}

.headline {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #377a6a;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
  color: #555;
}

.features {
  padding-left: 20px;
}

.features li {
  margin-bottom: 10px;
  color: #777;
}

.hero-image {
  width: 100%;
  border-radius: 20px;
}
</style>
