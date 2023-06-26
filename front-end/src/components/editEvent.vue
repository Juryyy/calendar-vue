<template>
  <v-container>
    <v-form type="submit">
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
        <v-select
        label="Select"
        v-model="state.selected"
        :items="options">
        </v-select>
      </v-col>

      <v-col cols="12" md="4">
      <v-btn color="green" @click="Create()">confirm reservation</v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn color="red" @click="Cancel()">cancel</v-btn>
      </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="8">
          <v-textarea label="description" v-model="state.description">

          </v-textarea>
        </v-col>

      </v-row>
    </v-form>
  </v-container>

</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { CalEvent } from '@/code/interface';
import { useEventStore } from '@/store/eventStore';

const eventStore = useEventStore();



const props = defineProps({
  event: {
    type: Object as () => CalEvent,
    required: true
  }
})

const state = reactive({
  selected: '',
  description: ''
})

async function Create() {
  const event = props.event;
  event.title = state.selected;
  event.description = state.description;
  event.status = 'reserved';
  event.userId = 1
  if(eventStore.pickedDate === undefined) {
    return console.log('no date picked');
  }
  event.startDate = eventStore.pickedDate;
  event.endDate = eventStore.pickedDate;
  await eventStore.createEvent(event);
}

function Cancel() {
  eventStore.formIndex = -2;
}

const options = ['Regular visit', 'Documentation', 'Vaccination', 'Surgery', 'Other']


</script>
