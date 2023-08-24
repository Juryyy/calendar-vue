<template>
  <v-app-bar app color="black"  density="comfortable">
    <v-app-bar-nav-icon @click.stop="state.drawer = !state.drawer"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <div v-if="authStore.user !== undefined" color="info">
      <router-link color="" to="/profile">
        <v-btn color="orange-lighten-1" icon="mdi-account-circle" size="large">
          <v-icon size="x-large"></v-icon>
        </v-btn>
      </router-link>
      <Logout />
    </div>
    <div v-else>
      <router-link to="/login">
        <v-btn class="text-blue-darken-2">Login</v-btn>
      </router-link>
      <router-link to="/register">
        <v-btn class="text-blue-darken-2">Register</v-btn>
      </router-link>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="state.drawer" app temporary>
    <v-list nav dense variant="plain" color="orange-lighten-1" lines="one" >
      <v-list-item link to="/" >
        <template v-slot:prepend>
          <v-icon>mdi-home</v-icon>
        </template>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item link to="/profile">
        <template v-slot:prepend>
          <v-icon>mdi-account</v-icon>
        </template>
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item link to="/calendar">
        <template v-slot:prepend>
          <v-icon>mdi-calendar</v-icon>
        </template>
        <v-list-item-title>Reservation</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import Logout from "@/components/Logout.vue";

const authStore = useAuthStore();

const state = reactive({
drawer: false,
});

const User = computed(() => authStore.user);


</script>

<style scoped>

.v-list-item:hover{
color:#40bdc2
}


</style>
