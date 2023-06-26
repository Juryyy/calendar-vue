// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Calendar from '@/components/Calendar.vue'
import HomePage from "@/components/HomePage.vue"
import Login from "@/components/Login.vue"
import Registration from "@/components/Registration.vue"
import { useAuthStore } from '@/store/authStore'



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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    component: Login,
    name: 'Login',
  },
  {
    path: '/register',
    component: Registration,
    name: 'Registration',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const authStore = useAuthStore();
  const isLoggedIn = authStore.user !== undefined;
  const isAdmin = authStore.user?.role !== 0;

  if (requiresAuth && !isLoggedIn) {
    authStore.afterLoginRoute = to;
    next({name: "Login"});
  } else if (requiresAdmin && !isAdmin) {
    next({name: "NotFound"});
  } else {
    next();
  }
});

export default router
