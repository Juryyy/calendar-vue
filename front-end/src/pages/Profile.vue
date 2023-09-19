<template>
<v-main>
  <v-container pt-5 background-color="blue" color="primary">
      <v-row>
        <v-col v-for="e in events" cols="12" sm="6" md="3">
          <v-card color=white variant="tonal">
            <v-card-title color="orange">{{ e.title }}</v-card-title>
            <v-card-text>
              <p>Start: {{e.startDate, e.startTime}}</p>
              <p>End: {{e.endDate, e.endTime}}</p>
              {{ e.description }}
            </v-card-text>
        	</v-card>
      </v-col>
    </v-row>
  </v-container>
</v-main>
</template>

<script setup lang="ts">
import {reactive, computed, ref, onMounted, watch} from 'vue'
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { CalEvent } from '@/code/interface';

const authStore = useAuthStore();
const eventStore = useEventStore();

const user = authStore.user;

onMounted(async() => {
  await eventStore.fetchEventsForUser();
})


const events = computed(() => eventStore.userEvents) as unknown as CalEvent[];
console.log(events)


</script>
<style scoped>
.v-container{
  margin-top: 5%;
}
</style>
