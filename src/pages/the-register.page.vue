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
  min-height: 100vh;
  background-color: white;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px 20px;
  min-height: calc(100vh - 80px);
}

.content {
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.left-side,
.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.left-side {
  background: linear-gradient(45deg, #75aa9c, #5a9e8e);
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.left-side::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.right-side {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  backdrop-filter: blur(10px);
}

.welcome-text {
  font-size: 2.5em;
  font-weight: 700;
  text-align: center;
  color: white;
  margin-bottom: 30px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  position: relative;
  z-index: 2;
}

.hero-image {
  width: 80%;
  max-width: 400px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
}

.hero-image:hover {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
    margin: 0 10px;
    max-width: none;
  }
  
  .left-side,
  .right-side {
    min-height: auto;
  }
  
  .left-side {
    padding: 40px 20px;
  }
  
  .right-side {
    padding: 30px 20px;
  }
  
  .welcome-text {
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  .hero-image {
    width: 70%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  main {
    padding: 70px 10px 10px;
  }
  
  .welcome-text {
    font-size: 1.8em;
  }
  
  .left-side {
    padding: 30px 15px;
  }
  
  .right-side {
    padding: 25px 15px;
  }
}
</style>