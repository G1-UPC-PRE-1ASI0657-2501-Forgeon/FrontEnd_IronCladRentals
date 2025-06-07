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
  background-color: #2c3e50;
  color: #fff;
  padding: 40px 0 20px;
  width: 100%;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 0 15px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
}

.footer-column {
  padding-bottom: 20px;
  flex: 1;
  min-width: 250px;
  text-align: center;
}

.footer h4 {
  color: #fff;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

.footer h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #377a6a;
}

.footer p {
  color: #ecf0f1;
  margin-bottom: 15px;
  line-height: 1.6;
}

.footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer li {
  margin-bottom: 12px;
  color: #ecf0f1;
  font-size: 15px;
}

.footer a {
  color: #fff;
  text-decoration: none;
}

.footer a:hover {
  color: #ccc;
}

.social-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 10px;
}

.social-icons li {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-icons li:hover {
  background-color: #377a6a;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.copyright {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #bdc3c7;
  font-size: 14px;
}

.icon i {
  font-size: 24px;
}
</style>
