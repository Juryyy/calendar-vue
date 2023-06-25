<template>
  <v-container>
  <v-responsive :aspect-ratio="4 / 3" class="border pa-4">
  <VDatePicker v-model.string="eventStore.pickedDate" mode="date" is-required :masks="masks" :disabledDates="disabledDates" is-dark="system" :min-date="minDate()"  />
  {{ eventStore.pickedDate }}
  <EventPicker/>
</v-responsive>
</v-container>
</template>

<script lang="ts" setup>
import { ref, reactive} from 'vue'
import EventPicker from './EventPicker.vue';
import { onMounted } from 'vue';
import { useEventStore } from '@/store/eventStore';

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



function minDate(){
  let today = new Date();
  if (today.getDay() === 0){
    today.setDate(today.getDate() + 1);
  } else if
  (today.getDay() === 6){
    today.setDate(today.getDate() + 2);
  }
  return today;
}
</script>
