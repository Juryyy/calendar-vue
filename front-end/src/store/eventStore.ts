import { axiosInstance, setBearerAuthToken } from "@/code/api";
import jwt_decode from "jwt-decode";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import Config from "@/config";
import {minDate} from "@/code/functions";

export const useEventStore = defineStore("event", () => {
   const events = reactive<any[]>([])

   const pickedDate = ref<string>()

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

   return {events, fetchEvents, pickedDate};
});
