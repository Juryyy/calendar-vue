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
        <tr v-for="event in generatedEvents">
          <td>{{ event.start }}</td>
          <td>{{ event.end }}</td>
          <td>{{ event.status }}</td>
          <td v-if="event.status === 'free'">
            <v-btn color="primary">Edit</v-btn>
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
import {reactive, computed, ref, onMounted} from 'vue'

interface Event {
  start: string;
  end: string;
  status: string;
}

const events: Event[] = [
  {
    start: '8:00',
    end: '8:20',
    status: 'free'
  },
  {
    start: '8:40',
    end: '9:00',
    status: 'free'
  },
  {
    start: '9:20',
    end: '9:40',
    status: 'free'
  }
];

const generatedEvents: Event[] = [];

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
    const existingEvent = events.find(event => event.start === start);
    if (existingEvent) {
      generatedEvents.push(existingEvent);
    } else {
      generatedEvents.push({
        start,
        end,
        status: 'empty'
      });
    }
  }
}
</script>
