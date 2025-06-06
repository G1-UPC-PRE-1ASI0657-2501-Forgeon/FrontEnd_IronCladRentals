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
  <div class="page-container">
    <header>
      <TheHeader/>
    </header>
    <main>
      <the-home-banner></the-home-banner>
    </main>
    <footer>
      <TheFooter/>
    </footer>
  </div>
</template>



<style scoped>

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
}

main {
  min-height: calc(100vh - 60px);
  background-color: white;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

footer {
  background-color: #2c3e50;
  padding: 0;
  font-size: 15px;
  line-height: 24px;
  color: #ffffff;
  width: 100%;
  z-index: 100;
  margin-top: auto;
}
</style>