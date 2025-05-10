<template>
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-4 col-sm-12">
          <div class="footer-column">
            <h4>Forgeon</h4>
            <p>Forgeon is an innovative startup committed to strengthening the rental sector</p>
          </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-12">
          <div class="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>Support: support@forgeon.com</li>
              <li>Phone: +51 971 323 578</li>
            </ul>
          </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-12">
          <div class="footer-column">
            <h4>Social</h4>
            <ul class="social-icons">
              <li class="icon"><i class="pi pi-facebook"></i></li>
              <li class="icon"><i class="pi pi-instagram"></i></li>
              <li class="icon"><i class="pi pi-twitter"></i></li>
              <li class="icon"><i class="pi pi-linkedin"></i></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="copyright">
        <p>&copy; 2025 Team Forgeon. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
}
</script>

<style scoped>
.footer {
  background-color: #333;
  color: #fff;
  padding: 10px 0;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.footer-column {
  padding-bottom: 20px;
}

.footer h4 {
  color: #fff;
}

.footer p {
  color: #ccc;
}

.footer ul {
  list-style: none;
  padding: 0;
}

.footer li {
  margin-bottom: 10px;
}

.footer a {
  color: #fff;
  text-decoration: none;
}

.footer a:hover {
  color: #ccc;
}

.social-icons {
  text-align: center;
}

.social-icons li {
  margin-right: 15px;
  display: inline-block; /* Mostrar en línea */
}

.icon i {
  font-size: 24px;
}
</style>
