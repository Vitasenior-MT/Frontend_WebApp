<template>
  <v-card id="login" >
    <v-card-title id="login_title"><p class="title mb-0">Login</p></v-card-title>
    <v-card-text id="login_box">
      <v-form>
          <v-text-field prepend-icon="fas fa-user" v-model="email" name="email" label="Email" id="email" type="text"></v-text-field>
          <v-text-field prepend-icon="fas fa-lock" v-model="password" name="password" label="Password" id="password" type="password"></v-text-field>
      </v-form>
      <v-btn small block flat class="primary--text" @click.native="forgotSw">forgot password</v-btn>
    </v-card-text>
    <v-card-actions class="bottom_action">
      <v-btn flat class="primary--text" to="/signup">register</v-btn>
      <v-spacer></v-spacer>
      <v-btn class="raven primary--text" @click.native="login">
        Login
        <v-icon dark right>fas fa-sign-in-alt</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "login",
  data: () => {
    return {
      email: "admin@a.aa",
      password: "123qweASD"
    };
  },
  methods: {
    login() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .post("/login", { password: this.password, email: this.email })
        .then(response => {
          if (response.data.token) {
            event_bus.$data.token = response.data.token;
            this.$store.commit("setUserData", {
              token: response.data.token,
              name: response.data.name,
              email: response.data.email,
              photo: response.data.photo,
              is_admin: response.data.is_admin
            });
            event_bus.$emit("login");
            event_bus.$emit("toast", {
              message: "Successfully logged",
              type: "success"
            });
          }
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
          event_bus.$emit("waiting", false);
        });
    },
    forgotSw() {
      this.$emit("forgot");
    },
    registerSw() {
      this.$emit("register");
    }
  }
};
</script>

<style>
#login{
  padding-bottom: 5px;
}
#login_title {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  height: 72px;
}
#login_box{
  height: 251px;
}
</style>
