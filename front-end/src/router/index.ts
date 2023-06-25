// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Calendar from '@/components/Calendar.vue'
import HomePage from "@/components/HomePage.vue"


const routes = [
  {
    path:'/',
    component: HomePage,
    name: 'Home',
  },
  {
    path: '/calendar',
    component: Calendar,
    name: 'Calendar',
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
