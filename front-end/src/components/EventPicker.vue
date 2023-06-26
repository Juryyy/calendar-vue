<template>
  <v-container :key="containerKey">
    <v-table v-if="eventStore.pickedDate !== undefined">
      <thead>
        <tr>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(event, index) in generatedEvents" :key="event.startTime">
          <tr>
            <td>{{ event.startTime }}</td>
            <td>{{ event.endTime }}</td>
            <td>{{ event.status }}</td>
            <td v-if="event.status === 'reserved'">
              <v-btn v-if="user" color="primary" @click="showForm(index)">Edit</v-btn>
              <v-btn color="error">Remove</v-btn>
            </td>
            <td v-else>
              <v-btn color="primary" @click="showForm(index)">Reserve</v-btn>
            </td>
          </tr>
          <!-- Add a new row after the selected event -->
          <tr v-if="eventStore.formIndex  === index">
            <td colspan="4">
              <edit-event :event="generatedEvents[index]" />
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>
  </v-container>
</template>


<script setup lang="ts">
import {reactive, computed, ref, onMounted, watch} from 'vue'
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import editEvent from './editEvent.vue'

const authStore = useAuthStore();
const eventStore = useEventStore();

const user = computed(() => authStore.user);

const containerKey = ref(0);

  function showForm(index: number) {
    eventStore.formIndex = index;
    state.index = index;
  }

const state = reactive({
  index: -2
})


const generatedEvents : CalEvent[] = [];

const events = computed(() => eventStore.events.filter(event => event.startDate === eventStore.pickedDate));

watch(() => eventStore.pickedDate, () => {
  fetchGeneratedEvents();
  containerKey.value++;
  eventStore.formIndex = -2;
})

function fetchGeneratedEvents(){
  generatedEvents.splice(0, generatedEvents.length);
for (let hour = 7; hour < 13; hour++) {
  for (let minute = 0; minute < 60; minute += 20) {
    const start = `${hour}:${minute.toString().padStart(2, '0')}`;
    let endHour = hour;
    let endMinute = minute + 20;
    if (endMinute === 60) {
      endHour += 1;
      endMinute = 0;
    }
    const end = `${endHour}:${endMinute.toString().padStart(2, '0')}`;
    const existingEvent = events.value.find(event => event.startTime.replace(/^0/, '') === start.replace(/^0/, ''));
    if (existingEvent) {
      generatedEvents.push({
        id: existingEvent.id,
        title: existingEvent.title,
        description: existingEvent.description,
        startDate: existingEvent.startDate,
        startTime: existingEvent.startTime.replace(/^0/, ''),
        endDate: existingEvent.endDate,
        endTime: existingEvent.endTime.replace(/^0/, ''),
        calEventId: existingEvent.calEventId,
        userId: existingEvent.userId,
        status: 'reserved'
      });
    } else {
      generatedEvents.push({
        startDate: new Date().toLocaleDateString('de-DE',{
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        startTime: start,
        endDate: new Date().toLocaleDateString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        endTime: end,
        status: 'free'
      })
    }
  }
}
}


interface CalEvent {
  id?: number;
  title?: string;
  description?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  calEventId?: string;
  userId?: number;
  status: string;
}

</script>
