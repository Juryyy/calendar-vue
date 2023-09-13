<template>
  <v-container :key="containerKey" id="my-table">
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
          <tr :id="index === eventStore.formIndex ? 'selected-table' : ''">
            <td>{{ event.startTime }}</td>
            <td>{{ event.endTime }}</td>
            <td>{{ event.status }}</td>
            <td v-if="event.status === 'reserved'">
              <v-btn class="mr-1" v-if="event.userId === user.id || user.role === 'ADMIN' " color="yellow-darken-3" @click="showForm(index, true)">Edit</v-btn>
              <v-btn class="ml-1" v-if="event.userId === user.id || user.role === 'ADMIN' " color="error">Remove</v-btn>
            </td>
            <td v-else>
              <v-btn color="primary" @click="showForm(index, false)">Reserve</v-btn>
            </td>
          </tr>
          <tr v-if="eventStore.formIndex === index">
            <td colspan="4">
              <edit-event :event="generatedEvents[index]" :editing="state.editing" />
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
import editEvent from '@/components/editEvent.vue';
import { CalEvent } from '@/code/interface';

const authStore = useAuthStore();
const eventStore = useEventStore();

const user = authStore.user;

const containerKey = ref(0);

  function showForm(index: number, editing: boolean) {
    eventStore.formIndex = index;
    state.index = index;
    state.editing = editing;
    eventStore.messageError = '';
    eventStore.errorValue = 0;
    eventStore.messageSuccess = '';
  }

const state = reactive({
  index: -2,
  editing: false
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

  const hourStart = parseInt(import.meta.env.VITE_HOUR_START || '7', 10);
  const hourEnd = parseInt(import.meta.env.VITE_HOUR_END || '13', 10);
  const minuteJump = parseInt(import.meta.env.VITE_MINUTE_JUMP || '20', 10);

for (let hour = hourStart; hour < hourEnd; hour++) {
  for (let minute = 0; minute < 60; minute += minuteJump) {
    const start = `${hour}:${minute.toString().padStart(2, '0')}`;
    let endHour = hour;
    let endMinute = minute + minuteJump;
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


</script>
<style>

#my-table .v-responsive,
#my-table .v-container,
#my-table .v-table,
#my-table .v-td,
#my-table .v-tr {
  background-color: #141c2e;
  color: #fff;
}

#my-table .v-table th{
  color: orange
}

#selected-table{
  background-color: rgb(70, 95, 72);
}

</style>
