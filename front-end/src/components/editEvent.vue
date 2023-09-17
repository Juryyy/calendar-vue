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
        v-model="titleModel"
        :items="options">
        </v-select>
      </v-col>

      <v-col cols="12" md="4">
      <v-btn v-if="!props.editing" color="green-darken-3" @click="Create()">Confirm reservation</v-btn>
      <v-btn v-else color="green-darken-3" @click="Edit()">Confirm edit</v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn color="red" @click="Cancel()">Cancel</v-btn>
      </v-col>

      </v-row>

      <v-row>
        <v-col cols="12" md="8">
          <v-textarea label="description" v-model="descriptionModel">

          </v-textarea>
        </v-col>

      </v-row>
      <v-chip class="d-flex justify-center " v-if="eventStore.messageError !== ''" color="red" variant="elevated">{{eventStore.messageError}}</v-chip>
      <v-chip class="d-flex justify-center " v-if="eventStore.messageSuccess !== ''" color="blue" variant="elevated">{{eventStore.messageSuccess}}</v-chip>
    </v-form>
  </v-container>

</template>

<script setup lang="ts">
import { ref, reactive, computed} from 'vue'
import { CalEvent } from '@/code/interface';
import { useEventStore } from '@/store/eventStore';
import { useAuthStore } from '@/store/authStore';

const eventStore = useEventStore();
const authStore = useAuthStore();


const emit = defineEmits(['update:title', 'update:description', 'update:editing'])

const props = defineProps({
  event: {
    type: Object as () => CalEvent,
    required: true
  },
  editing: {
    type: Boolean,
    required: true
  }
})

const state = reactive({
  selected: '',
  description: ''
})

async function Create() {
  console.log('halooo1')
  props.event.title = state.selected;
  props.event.description = state.description;
  props.event.status = 'reserved';
  props.event.userId = authStore.user.id;
  if(eventStore.pickedDate === undefined) {
    return console.log('no date picked');
  }
  props.event.startDate = eventStore.pickedDate;
  props.event.endDate = eventStore.pickedDate;
  console.log('halooo3')
  await eventStore.createEvent(props.event);
  console.log('halooo2')
  const month = new Date(props.event.startDate).getMonth();
  console.log('halooo')

  if(eventStore.errorValue !== 0) {
    console.log('error');
    return;
  }else{
    console.log('success');
    await eventStore.fetchEvents(month);
  }
  console.log('test');
  eventStore.messageSuccess = 'Reservation created'
  Cancel();
}

async function Edit() {
  // * not working
  props.event.title = state.selected;
  props.event.description = state.description;
  await eventStore.editEvent(props.event);
  eventStore.messageSuccess = 'Reservation edited'
}

function Cancel() {
  eventStore.formIndex = -2;
  eventStore.errorValue = 0;
  eventStore.messageSuccess = '';
  eventStore.messageError = '';
  emit('update:editing', false);
}

const options = import.meta.env.VITE_OPTIONS.split(',');

const titleModel = computed<string>({
  get: () => (props.event.status === "reserved" && props.event.title ? props.event.title : state.selected),
  set: (value: string) => {
    state.selected = value;
    emit('update:title', value);
  },
});

const descriptionModel = computed<string>({
  get: () => (props.event.status === "reserved" && props.event.description ? props.event.description : state.description),
  set: (value: string) => {
    state.description = value;
    emit('update:description', value);
  },
});


</script>
