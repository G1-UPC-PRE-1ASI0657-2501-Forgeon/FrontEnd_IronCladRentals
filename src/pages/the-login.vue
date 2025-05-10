<template>
  <div class="container">
    <header>
      <the-header-start-component></the-header-start-component>
    </header>
    <br/> <br/>
    <main>
      <div class="content">
        <div class="left-side">
          <h1 class="welcome-text">Iron Clad Rentals</h1>
          <div class="image-container">
            <img src="..\..\src\assets\images\login.png" alt="image of farmer" class="hero-image" role="img" aria-label="Image of Farmer">
          </div>
          <div class="form-container">
            <the-login-form></the-login-form>
          </div>
        </div>
        <div class="right-side">
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheLoginForm from "@/components/account/the-login-form.component.vue";
import theHeaderStartComponent from "@/components/elements/the-header-start.component.vue";

export default {
  name: 'TheLogin',
  components: {
    theHeaderStartComponent,
    TheLoginForm,
    TheHeaderSession
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-left: 400px;
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
  max-width: 1200px;
  margin: auto;
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
  padding: 10px;
}

.form-container {
  width: 400px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -60px;
}

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.hero-image {
  width: 35%;
  max-width: 300px;
  height: auto;
  border-radius: 20px;
}
</style>
