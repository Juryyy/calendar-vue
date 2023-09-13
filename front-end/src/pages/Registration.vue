<template>
  <v-main>
      <v-sheet width="35%" class="mx-auto pb-10 mt-15 pl-10 pr-10">
        <v-alert v-if="state.error !== '' " variant="tonal" type="warning" closable close-label="Close Alert">
          {{ state.error }}
        </v-alert>
        <v-form @submit.prevent="register()" size="10x" class="mx-auto my-7">
          <h2 style="color:orange; text-align:center">Registration form</h2>
          <v-row class="mx-auto">
            <v-col cols="12" md="6">
              <v-text-field label="Firstname" v-model="state.firstname" :rules="UserFirstnameRules"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Lastname" v-model="state.lastname" :rules="UserLastnameRules"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Email" v-model="state.email" :rules="UserEmailRules"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Password" v-model="state.password" name="input-14" :rules="PasswordRegisterRules" @input="checkPasswordStrength" type="password"></v-text-field>
              <v-chip size="small" class="mb-2" :color="passwordStrengthColor" >{{state.strength}}</v-chip>
              <v-progress-linear   :value="passwordStrengthValue" height="7" rounded
                :color="passwordStrengthColor"></v-progress-linear>
            </v-col>
            <v-btn type="submit" color="primary" class="mx-6 my-6">Create account</v-btn>
          </v-row>
        </v-form>
      </v-sheet>
  </v-main>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { UserEmailRules, PasswordRegisterRules, UserFirstnameRules, UserLastnameRules} from "@/code/rules";

const authStore = useAuthStore();

const router = useRouter();

const state = reactive({
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  strength: "weak",
  error:"",
});

async function register() {
  if(state.firstname === "" || state.lastname === "" || state.email === "" || state.password === ""){
    state.error = "Please fill all required fields"
    return
  }
  const response = await authStore.register(
    state.firstname,
    state.lastname,
    state.email,
    state.password,
  );
  if (response.error === null) {
    await router.push({ name: "Login" });
  } else {
    state.error = "Email already exists"
  }
}

function checkPasswordStrength() {
  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

  if (strongRegex.test(state.password)) {
    state.strength = "strong";
  } else if (mediumRegex.test(state.password)) {
    state.strength = "medium";
  } else {
    state.strength = "weak";
  }
}

const passwordStrengthValue = computed(() => {
  switch (state.strength) {
    case "strong":
      return 100;
    case "medium":
      return 50;
    default:
      return 25;
  }
});

const passwordStrengthColor = computed(() => {
  switch (state.strength) {
    case "strong":
      return "green";
    case "medium":
      return "orange";
    default:
      return "red";
  }
});
</script>

<style scoped>
form {
  margin-top: 10.5vh;
  color: white;
}
.v-sheet{
  background-color: #10151b;;
}
</style>
