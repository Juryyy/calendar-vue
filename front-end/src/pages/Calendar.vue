<template>
  <v-main>
  <v-container>
  <v-responsive :aspect-ratio="4 / 3" class="border pa-4">
  <VDatePicker v-model.string="eventStore.pickedDate" mode="date" expanded is-required :masks="masks" :disabledDates="disabledDates" is-dark="system" :min-date="minDate()" class="mb-5"/>
  <v-chip class="d-flex justify-center " color="amber-lighten-1" variant="elevated"  v-if="eventStore.pickedDate === undefined"> Please select avaliable date </v-chip>
  <v-chip class="d-flex justify-center " color="light-green-lighten-1" variant="elevated"  v-else> Your selected date: {{ eventStore.pickedDate }}</v-chip>

  <EventPicker/>
</v-responsive>
</v-container>
</v-main>
</template>

<script lang="ts" setup>
import { ref, reactive} from 'vue'
import EventPicker from './EventPicker.vue';
import { onMounted } from 'vue';
import { useEventStore } from '@/store/eventStore';
import { minDate } from '@/code/functions';

const eventStore = useEventStore();

onMounted(async () => {
  await eventStore.fetchEvents(minDate().getMonth());
});


const state = reactive({
  date: minDate().toLocaleDateString('de-DE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
})

const masks = ref({
  modelValue: 'DD.MM.YYYY',
});

const disabledDates = ref([
  {
    repeat: {
      weekdays: [7,1],
    }
  }
])


</script>

<style scoped>
.v-responsive{
  background-color:#0e1422 ;
}
</style>
