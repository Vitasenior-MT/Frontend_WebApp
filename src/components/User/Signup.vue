<template>
    <div class="text-md-center">
        <h2>Register User</h2>
        <v-layout>
            <v-flex xs6 offset-xs3>
                <v-card>
                    <v-card-text>
                        <v-text-field v-model="username" label="Username" required></v-text-field>
                        <v-text-field v-model="email" label="Email" required></v-text-field>
                        <v-text-field v-model="password" label="Password" required></v-text-field>
                    </v-card-text>
                </v-card>
                 <v-btn class="mb-3" success @click='registerUser'>Register</v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
        username: "",
        email: "",
        password: ""
    };
  },
  methods: {
    registerUser() {
      event_bus.$data.http
        .post("/register", { password: this.password, name: this.username, email: this.email })
        .then(response => {
          let newToken = response.data.token;
          window.token = newToken;
          localStorage.setItem("token", newToken);
          window.axios.defaults.params = { api_token: newToken };
          event_bus.$emit("toast", {
            message: "Successfully registered",
            type: "success"
          });
          this.$router.push("/");
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", { message: error.message, type: "error" });
          }
        });
    }
  }
};
</script>