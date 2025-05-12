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




const routes = [
    { path: '/', component: TheMain },
    { path: '/login', component: TheLogin },
    { path: '/register', component: TheRegister },
    { path: '/landlord-vehicles', component: theLandlordVehicles },
    { path: '/company-register', component: TheCompanyRegister },
    { path: '/home', component: theHomePage },
    { path: '/users', component: TheLogin },
    { path: '/seach-vehicles', component: theSearchVehicles},
    { path: '/vehicle/:id', component: theVehicleDetails },
    { path: '/:pathMatch(.*)*', component: thePageNotFoundPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
