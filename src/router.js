import TheLogin from '@/pages/the-login.vue'
import TheRegister from '@/pages/the-register.page.vue'
import TheMain from '@/pages/the-main.vue'
import theHomePage from "@/pages/the-home.page.vue";
import { createRouter, createWebHistory } from 'vue-router'
import thePageNotFoundPage from "@/pages/the-page-not-found.page.vue";
import theLandlordVehicles from "@/pages/the-landlord-vehicles.vue";
import TheCompanyRegister from "@/pages/the-company-register.vue";
import theSearchVehicles from "@/pages/the-search-vehicles.vue";
import theVehicleDetails from "@/pages/the-vehicle-details.vue";
import theUserConfig from "@/pages/the-user-config.vue";
import thePricingPage from "@/pages/the-pricing.page.vue";
import thePaymentsMethods from "@/pages/the-payments-methods.vue";
import TheRentCreation from "@/pages/the-rent-creation.page.vue";
import TheRentListPage from "@/pages/the-rent-list.page.vue";
import TheActiveRentPage from "@/pages/the-active-rent-page.vue";
import TheVehicleRegister from './pages/the-vehicle-register.vue';
import Arrendatario from './pages/Arrendatario.vue';
import TheReservationsPage from './pages/the-reservations-page.vue';
import TheCompanyVehicles from './pages/the-company-vehicles.vue';

const routes = [
    { path: '/', component: TheMain },
    { path: '/login', component: TheLogin },
    { path: '/register', component: TheRegister },
    { path: '/company-register', component: TheCompanyRegister },
    { path: '/vehicles/create', component: TheVehicleRegister },
    { path: '/vehicles', component: TheCompanyVehicles },
    { path: '/landlord-vehicles', component: theLandlordVehicles },
    { path: '/landlord/vehicles/pricing/:vehicleId?', component: thePricingPage },
    { path: '/edit', component: thePricingPage },
    { path: '/home', component: theHomePage },
    { path: '/users', component: TheLogin },
{
  path: '/arrendatario',
  component: Arrendatario,
  children: [
    { path: 'search-vehicles', component: theSearchVehicles },
    { path: 'rent-list', component: TheRentListPage },
    { path: 'payment-methods', component: thePaymentsMethods },
    { path: 'user-config', component: theUserConfig },
  ]
},    { path: '/vehicle/:id', component: theVehicleDetails },
    { path: '/user-config', component: theUserConfig },
    { path: '/:pathMatch(.*)*', component: thePageNotFoundPage },
    { path: '/payment-methods', component: thePaymentsMethods },
    { path: '/rent/:id', component: TheRentCreation },
    { path: '/rent-list', component: TheRentListPage },
    { path: '/active-rents', component: TheActiveRentPage },
    { path: '/reservations', component: TheReservationsPage },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
