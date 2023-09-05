import { axiosInstance, setBearerAuthToken } from "@/code/api";
import jwt_decode from "jwt-decode";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import Config from "@/config";
import {minDate} from "@/code/functions";
import { CalEvent } from "@/code/interface";

export const useEventStore = defineStore("event", () => {
   const events = reactive<any[]>([])

   const pickedDate = ref<string>()
   const formIndex = ref<number>(-2)

   const messageError = ref<string>('')
   const messageSuccess = ref<string>('')
   const errorValue = ref<number>(0)


    async function fetchEvents(month : number) {
        try {
            const response = await axiosInstance.get(Config.apiUrl + "/events/all/" + month);
            events.splice(0, events.length, ...response.data)
            return response.data;
        } catch (error : any){
            return {
                error: error.response?.data?.message ?? "Unknown error",
            };
        }
    }

    async function createEvent(event: CalEvent) {
      try {
        const response = await axiosInstance.post(Config.apiUrl + "/events/create", event);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          messageError.value = "Reservation failed: fill all fields";
          errorValue.value = 400;
        } else if (error.response && error.response.status === 409) {
          errorValue.value = 409;
          messageError.value = "Reservation failed: date already reserved";
        } else {
          messageError.value = "Unknown error";
        }
        return {
          error: messageError.value,
        };
      }
    }

    async function editEvent( event: CalEvent){
      try {
        const response = await axiosInstance.put(Config.apiUrl + "/events/update", event);
        return { error: null };
      }
      catch (error : any){
        return {
          error: error.response?.data?.message ?? "Unknown error",
        };
      }
    }

   return {events, fetchEvents, pickedDate, formIndex, createEvent, editEvent, messageError, errorValue, messageSuccess};
});
