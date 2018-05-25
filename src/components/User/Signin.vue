<template>
    <v-content id="login">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field id="email" v-model="email" prepend-icon="mdi-account" name="login" label="Login" type="text" required></v-text-field>
                  <v-text-field id="password" v-model="password" prepend-icon="mdi-lock" name="password" label="Password" type="password" required></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="$router.go(-1)" color="grey" >
                  <v-icon dark right>mdi-keyboard-return</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn type="submit" @click='login' v-bind:class="loading">
                  Login
                  <v-icon dark right>mdi-login</v-icon>
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
  name: "Signin",
  data(router) {
    return {
      section: "Signin",
      loading: "",
      response: "",
      email: "jose@a.aa",
      password: "123qweASD"
    };
  },
  methods: {
    login() {
      event_bus.$data.http
        .post("/login", { password: this.password, email: this.email })
        .then(response => {
          event_bus.$data.token = response.data.token;
          this.$store.commit("setUserData", {
            token: response.data.token,
            name: response.data.name,
            email: response.data.email,
            photo: response.data.photo
          });
          event_bus.$emit("login", response.data.name);
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

<style>
</style>
