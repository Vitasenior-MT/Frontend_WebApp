<template>
  <v-content id="auth">
    <v-container fill-height>
      <v-layout justify-center wrap align-center class="pb-5 mb-5">
        <v-flex id="auth_card">
          <v-card id="login">
            <v-card-title id="login_title">
              <p class="title mb-0">{{ $t('user.auth.login') }}</p>
            </v-card-title>
            <v-card-text id="login_box">
              <v-text-field
                prepend-icon="fas fa-user"
                v-model="email"
                name="email"
                :label="$t('user.auth.email')"
                id="email"
                type="text"
              ></v-text-field>
              <v-text-field
                prepend-icon="fas fa-lock"
                v-model="password"
                name="password"
                :label="$t('user.auth.pass')"
                id="password"
                type="password"
              ></v-text-field>
              <v-btn
                small
                block
                flat
                class="primary--text"
                to="/forgot"
              >{{ $t('user.auth.forgot_label') }}</v-btn>
            </v-card-text>
            <v-card-actions class="bottom_action">
              <v-btn flat class="primary--text" to="/signup">{{ $t('user.auth.register') }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="raven primary--text" @click.native="login">
                {{ $t('user.auth.login') }}
                <v-icon dark right>fas fa-sign-in-alt</v-icon>
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
  name: "login",
  data: () => {
    return {
      email: process.env.NODE_ENV === "production" ? "" : "jose@a.aa",
      password: process.env.NODE_ENV === "production" ? "" : "123qweASD"
    };
  },
  mounted() {
    this.$el.addEventListener("keypress", event => {
      if (event.key == "Enter") this.login();
    });
  },
  beforeDestroy() {
    this.$el.removeEventListener("keypress", event => {
      if (event.key == "Enter") this.login();
    });
  },
  methods: {
    login() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .post("/login", { password: this.password, email: this.email })
        .then(response => {
          if (response.data.token) {
            event_bus.$data.token = response.data.token;
            this.$store.commit("setUserData", response.data);
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
    }
  }
};
</script>

<style>
#login {
  padding-bottom: 5px;
}
#login_title {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  height: 72px;
}
#login_box {
  height: 251px;
}
#auth {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../../../assets/fotoLar.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100%;
}
#auth_card {
  max-width: 400px;
}
</style>
