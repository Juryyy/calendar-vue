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

    async function fetchEvents(month : number) {
        try {
            const response = await axiosInstance.get(Config.apiUrl + "/events/all/" + month);
            events.splice(0, events.length, ...response.data)
            return { error: null };
        } catch (error : any){
            return {
                error: error.response?.data?.message ?? "Unknown error",
            };
        }
    }

    async function createEvent(event : CalEvent) {
        try {
            const response = await axiosInstance.post(Config.apiUrl + "/events/create", event);
            events.push(response.data);
            return { error: null };
        } catch (error : any){
            return {
                error: error.response?.data?.message ?? "Unknown error",
            };
        }
    }

   return {events, fetchEvents, pickedDate, formIndex, createEvent};
});
