<template>
  <v-btn icon="mdi-logout" size="large" @click="logout()">
  </v-btn>

</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout();
  router.push({name:"Home"});

}

</script>
