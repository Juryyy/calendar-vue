<template>
  <v-main>
      <v-sheet width="35%" class="mx-auto pb-10 mt-15">
        <v-form @submit.prevent="login()" size="10" border="10" class="pt-10 pl-10 pr-10">
          <v-text-field label="Email" v-model="state.email" :rules="UserEmailRules"></v-text-field>
          <v-text-field label="Password" v-model="state.password" :rules="PasswordRules" type=""></v-text-field>
          <v-btn type="submit" color="primary">Login</v-btn>
          <v-alert v-if="state.invaliduser" type="warning" density="compact" class="mt-5 shake" >Invalid email or password</v-alert>
        </v-form>
      </v-sheet>
  </v-main>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();

const router = useRouter();

const state = reactive({
  email: "",
  password: "",
  invaliduser: false,
});

async function login() {
  await authStore.login(state.email, state.password);
  if (authStore.user !== undefined) {
    await router.push(authStore.afterLoginRoute ?? { name: "Home" });
    authStore.afterLoginRoute = null;
  } else {
    state.invaliduser = true;
  }
}

const UserEmailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => v.length >= 5 || "Email must be at least 5 characters",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const PasswordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 4 || "Password must be at least 4 characters",
];
</script>

<style scoped>
form {
  margin-top: 10.5vh;
  color: white;
}
.v-sheet{
  background-color: #10151b;;
}

@keyframes shake {
  0% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s linear;
}
</style>
