<template>
    <div class="text-md-center">
        <h2>Sign In</h2>
        <v-layout>
            <v-flex xs6 offset-xs3>
                <v-card>
                    <v-card-text>
                        <v-text-field v-model="email" label="Email" required></v-text-field>
                        <v-text-field v-model="password" label="Password" required></v-text-field>
                    </v-card-text>
                    <v-btn class="mb-3" success @click='login'>Login</v-btn>
                </v-card>
            </v-flex>
        </v-layout>
        <a @click="$router.go(-1)">back</a>
    </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
      email: "admin@a.aa",
      password: "123qweASD"
    };
  },
  methods: {
    login() {
      event_bus.$data.http
        .post("/login", { password: this.password, email: this.email })
        .then(response => {
          let username = response.data.name;
          localStorage.setItem("token", response.data.token);
          event_bus.$data.token = response.data.token;
          localStorage.setItem("username", username);
          event_bus.$emit("login", username);
          event_bus.$emit("toast", {
            message: "Successfully logged",
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