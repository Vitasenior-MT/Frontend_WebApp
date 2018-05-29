<template>
    <v-content id="login">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark>
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field id="username" v-model="username" prepend-icon="mdi-account" name="username" label="Username" type="text" required></v-text-field>
                  <v-text-field id="email" v-model="email" prepend-icon="mdi-email" name="email" label="Email" type="text" required></v-text-field>
                  <v-text-field id="password" v-model="password" prepend-icon="mdi-lock" name="password" label="Password" type="password" required></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="$router.go(-1)" color="grey" >
                  <v-icon dark right>mdi-keyboard-return</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" @click='registerUser' v-bind:class="loading">
                  Register
                  <v-icon dark right>mdi-account-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
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

<style>
</style>