<template>
  <v-main>
    <v-sheet>
      <v-container>
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable.
        </p>
        <v-btn color="primary" to="/">Go to Home</v-btn>
      </v-container>
    </v-sheet>
  </v-main>
</template>

<script setup lang="ts">
</script>

<style>
.v-sheet{
  background-color:#090d17 ;
  color: white;
}
</style>
