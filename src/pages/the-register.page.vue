<template>
  <div class="container">
    <header>
      <TheHeaderStart></TheHeaderStart>
    </header>
    <main>
      <div class="content">
        <div class="left-side">
          <br/>
          <h1 class="welcome-text">Welcome to  Ironclad Rentals</h1>
          <img src="..\..\src\assets\images\register.png" alt="image of farmer" class="hero-image" role="img" aria-label="Image of Farmer">
        </div>
        <div class="right-side">
          <the-register-form></the-register-form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheRegisterForm from "@/components/account/the-register-form.component.vue";
import TheHeaderStart from "@/components/elements/the-header-start.component.vue";

export default {
  name: 'the-register',
  components: { TheRegisterForm, TheHeaderSession, TheHeaderStart }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-left: 90px;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

}

.content {
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 60000px;
  max-width: 1200px;

}

.left-side,
.right-side {
  flex: 1;
  border-radius: 10px;
}

.left-side {
  background-color: #75aa9c;

}

.right-side {
  background-color: #ffffff;
}
.welcome-text {
  font-size: 3em;
  font-weight: bold;
  text-align: center;
  padding: 50px;

}

.hero-image {
  width: 85%;
  height: auto;
  border-radius: 30px;
  padding-left: 30px;

}
</style>