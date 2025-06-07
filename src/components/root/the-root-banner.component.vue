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
  background-color: white;
  padding: 40px 0;
  min-height: calc(100vh - 60px); /* Ajustar al alto de la pantalla menos el header */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.03);
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.col-lg-6 {
  flex: 1;
  min-width: 300px;
  max-width: 560px;
}

.left-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.right-section {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.headline {
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #377a6a;
  line-height: 1.2;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
  color: #555;
}

.features {
  padding-left: 0;
  list-style-type: none;
}

.features li {
  margin-bottom: 12px;
  color: #555;
  position: relative;
  padding-left: 28px;
}

.features li:before {
  content: "✓";
  color: #377a6a;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.hero-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-image:hover {
  transform: scale(1.02);
}
</style>
