<template>
  <v-content id="auth">
    <v-container fill-height>
      <v-layout justify-center wrap align-center class="pb-5 mb-5">
        <v-flex id="auth_card">
          <v-card  id="register">
            <v-card-title id="register_title"><p class="title mb-0">Register</p></v-card-title>
            <v-card-text id="register_box">
              <v-form>
                <v-text-field id="username" v-model="username" prepend-icon="fas fa-user" name="username" label="Username" type="text" required></v-text-field>
                <v-text-field id="email" v-model="email" prepend-icon="fas fa-envelope" name="email" label="Email" type="text" required></v-text-field>
                <v-text-field id="password" v-model="password" prepend-icon="fas fa-lock" name="password" label="Password" type="password" required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn flat class="primary--text" to="/signin">login</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="raven primary--text" @click='registerUser'>
                Register
                <v-icon dark right>fas fa-user-plus</v-icon>
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
  mounted() {
    this.$el.addEventListener("keypress", event => {
      if (event.key == "Enter") this.registerUser();
    });
  },
  beforeDestroy() {
    this.$el.removeEventListener("keypress", event => {
      if (event.key == "Enter") this.registerUser();
    });
  },
  methods: {
    registerUser() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .post("/register", {
          password: this.password,
          name: this.username,
          email: this.email
        })
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
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style>
#register {
  padding-bottom: 5px;
}
#register_title {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  height: 72px;
}
#register_box {
  height: 251px;
}
@media only screen and (orientation: portrait) {
  #auth {
    background-image: url("../../assets/2.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
  }
}
@media only screen and (orientation: landscape) {
  #auth {
    background-image: url("../../assets/1.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
  }
}
#auth_card {
  max-width: 400px;
}
</style>