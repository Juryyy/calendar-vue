<template>
    <v-container>
     <v-table>
      <thead>
        <tr>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {{ events }}
        <tr v-for="event in generatedEvents">
          <td>{{ event.startTime }}</td>
          <td>{{ event.endTime }}</td>
          <td>{{ event.status }}</td>
          <td v-if="event.status === 'free'">
            <v-btn v-if="user" color="primary">Edit</v-btn>
            <v-btn color="error" >Delete</v-btn>
          </td>
          <td v-else>
            <v-btn color="green">Reserve</v-btn>
          </td>
        </tr>
      </tbody>
     </v-table>
    </v-container>
</template>

<script setup lang="ts">
import {reactive, computed, ref, onMounted, watch} from 'vue'
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { on } from 'events';

const authStore = useAuthStore();
const eventStore = useEventStore();

const user = computed(() => authStore.user);


interface Event {
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


const generatedEvents : Event[] = [];

const events = computed(() => eventStore.events.filter(event => event.startDate === eventStore.pickedDate));

watch(() => eventStore.pickedDate, () => {
  fetchGeneratedEvents();
})

onMounted(() => {
  fetchGeneratedEvents();
})

function fetchGeneratedEvents(){
  generatedEvents.splice(0, generatedEvents.length);
  console.log('fetching events')
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
    const existingEvent = events.value.find(event => event.startTime === start);
    if (existingEvent) {
      generatedEvents.push({
        id: existingEvent.id,
        title: existingEvent.title,
        description: existingEvent.description,
        startDate: existingEvent.startDate,
        startTime: existingEvent.startTime,
        endDate: existingEvent.endDate,
        endTime: existingEvent.endTime,
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


</script>
