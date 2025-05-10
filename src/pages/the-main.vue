<script>
import TheHeader from "@/components/elements/the-main-header.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import TheHomeBanner from "@/components/root/the-root-banner.component.vue";

export default {
  name: 'the-main',
  components: {
    TheHomeBanner,
    TheHeader,
    TheFooter
  }
}
</script>

<template>
  <header>
    <TheHeader/>
  </header>
  <main>
    <the-home-banner></the-home-banner>

  </main>

  <footer>
    <TheFooter/>
  </footer>
</template>



<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

main {
  padding-top: 0px; /* Ajuste para subir el main */
  padding-bottom: 150px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 249, 250, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

footer {
  background-color: #4f4d4d;
  padding: 10px 0 10px;
  font-size: 15px;
  line-height: 24px;
  color: #737373;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>