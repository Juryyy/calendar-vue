import { axiosInstance, setBearerAuthToken } from "@/code/api";
import jwt_decode from "jwt-decode";
import { defineStore } from "pinia";
import { ref } from "vue";
import Config from "@/config";
import { RouteLocationNormalized } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref();

  const afterLoginRoute = ref<RouteLocationNormalized | null>(null);

  function reloadUser() {
    const token = localStorage.getItem("token");
    if (token) {
      setBearerAuthToken(token);
      user.value = jwt_decode(token);
  }}

  async function login(email : string, password : string) {
    try {
      const response = await axiosInstance.post(Config.apiUrl + "/auth/login", {email, password});

      const token = response.data.token;
      setBearerAuthToken(token);
      localStorage.setItem("token", token);
      user.value = jwt_decode(token);
      console.log(user.value)
      return { error: null };
    } catch (error: any) {
      return {
        error: error.response?.data?.message ?? "Unknown error",
      };
    }
  }

  function logout() {
    user.value = undefined;
    localStorage.removeItem("token");
  }

  async function register(firstName : string, lastName : string, email : string, password : string){
    try{
      const response = await axiosInstance.post(Config.apiUrl + "/auth/register", {firstName, lastName, email, password});
      console.log(response)
      return { error: null };
    }
    catch (error: any) {
      return {
        error: error.response?.data?.message ?? "Unknown error",
      };
    }

  }

  return { login, logout, reloadUser, user, afterLoginRoute, register};
});
