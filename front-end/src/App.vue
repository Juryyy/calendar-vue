<template>
  <v-app>
    <app-bar/>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import AppBar from './layouts/default/AppBar.vue';
import {useAuthStore} from "@/store/authStore";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(() => {
  authStore.reloadUser();
});

</script>

<style scoped>
.v-main, .v-app{
  background-color: #090d17
}
.v-sheet, .v-card, .v-navigation-drawer, .v-navigation-drawer__content{
  background-color: #090d17;
  color : whitesmoke;
}
</style>
