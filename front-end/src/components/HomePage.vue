<template>
  <v-container class="fill-height">
      <v-img
        contain
        height="300"
        src="@/assets/logo.svg"
      />

      <router-link to="/calendar">
        <v-btn color="primary">Calendar</v-btn>
      </router-link>

  </v-container>
</template>

<script lang="ts" setup>
  //
</script>
