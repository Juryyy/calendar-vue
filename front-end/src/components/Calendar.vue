<template>
  <v-container>
  <v-responsive :aspect-ratio="4 / 3" class="border pa-4">
  <VDatePicker v-model.string="state.date" mode="date" is-required :masks="masks" :disabledDates="disabledDates" is-dark="system" :min-date="new Date()" />
  {{ state.date }}
  <EventPicker />
</v-responsive>
</v-container>
</template>

<script lang="ts" setup>
import { ref, reactive} from 'vue'
import EventPicker from './EventPicker.vue';

const state = reactive({
  date: new Date().toLocaleDateString('cs-CZ', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})
})

const masks = ref({
  modelValue: 'DD. MM. YYYY',
});

const disabledDates = ref([
  {
    repeat: {
      weekdays: [7,1],
    }
  }
])
</script>
