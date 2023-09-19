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
             <!-- <v-btn class="mr-1" v-if="event.userId === user.id || user.role === 'ADMIN' " color="yellow-darken-3" @click="showForm(index, true)">Edit</v-btn>-->
              <v-btn class="ml-1" v-if="event.userId === user.id || user.role === 'ADMIN' " color="error" @click="removeEvent(index)">Remove</v-btn>
            </td>
            <td v-else>
              <v-btn color="primary" @click="showForm(index, false)">Reserve</v-btn>
            </td>
          </tr>
          <tr v-if="eventStore.formIndex === index">
            <td colspan="4">
              <edit-event
              :event="generatedEvents[index]"
              :editing="state.editing"
              @update:title="updateTitle(index, $event)"
              @update:description="updateDescription(index, $event)"
              @update:editing="state.editing = $event"
              />
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
import { CFG_HOUR_END, CFG_HOUR_START, CFG_MINUTE_JUMP } from '@/eventConfig'

const authStore = useAuthStore();
const eventStore = useEventStore();

const user = authStore.user;

const containerKey = ref(0);

const generatedEvents : CalEvent[] = [];

const events = computed(() => eventStore.events.filter(event => event.startDate === eventStore.pickedDate));

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

async function removeEvent(index: number){
  const eventId = generatedEvents[index].id;
  await eventStore.deleteEvent(eventId);
  generatedEvents.splice(index, 1);
  var pom = eventStore.pickedDate
  eventStore.pickedDate = undefined;
  eventStore.pickedDate = pom;
}

watch( () => eventStore.pickedDate, async () => {
  if(eventStore.pickedDate !== undefined){
    const dateParts = eventStore.pickedDate.split('.');
    if(eventStore.pickedMonth !== parseInt(dateParts[1]))
    {
      eventStore.pickedMonth = parseInt(dateParts[1]);
      await eventStore.fetchEvents(parseInt(dateParts[1]));
    }
  }
  fetchGeneratedEvents();
  containerKey.value++;
  eventStore.formIndex = -2;
})


function updateTitle(index: number, title: string) {
  const matchingEventIndex = eventStore.events.findIndex(event => event.calEventId === generatedEvents[index].calEventId);
  if (matchingEventIndex !== -1) {
    eventStore.events[matchingEventIndex].title = title;
  }
  generatedEvents[index].title = title;
}

function updateDescription(index: number, description: string) {
  const matchingEventIndex = eventStore.events.findIndex(event => event.calEventId === generatedEvents[index].calEventId);
  if (matchingEventIndex !== -1) {
    eventStore.events[matchingEventIndex].description = description;
  }
  generatedEvents[index].description = description;
}

function fetchGeneratedEvents() {
  generatedEvents.splice(0, generatedEvents.length);

  const hourStart = CFG_HOUR_START || 7;
  const hourEnd = CFG_HOUR_END || 13;
  const minuteJump = CFG_MINUTE_JUMP || 15;

  let previousEnd = null; // Add this variable to store the end time of the previous event

  for (let time = hourStart * 60; time < hourEnd * 60; time += minuteJump) {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    const start = previousEnd || `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    let endHour = Math.floor((time + minuteJump) / 60);
    let endMinute = (time + minuteJump) % 60;
    const end = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    // Check if the end time exceeds CFG_HOUR_END
    if (endHour > hourEnd || (endHour === hourEnd && endMinute > 0)) {
      break;
    }

    previousEnd = end; // Always update previousEnd to the end of the current event

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
        startDate: new Date().toLocaleDateString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        startTime: start, // Use the previous end time as the start time
        endDate: new Date().toLocaleDateString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        endTime: end,
        status: 'free'
      });
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
  color: orange;
  background-color: #090c14;
}

#selected-table{
  background-color: rgb(70, 95, 72);
}

/* Add the following CSS rules */
#my-table .v-table tbody tr:nth-child(even) {
  background-color: #141c2e;
}

#my-table .v-table tbody tr:nth-child(odd) {
  background-color: #445163;
}
</style>
