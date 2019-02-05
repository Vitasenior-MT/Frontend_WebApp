<template>
  <v-content id="auth">
    <v-container fill-height>
      <v-layout justify-center wrap align-center class="pb-5 mb-5">
        <v-flex id="auth_card">
          <v-card id="register">
            <v-card-title id="register_title">
              <p class="title mb-0">{{ $t('user.auth.register') }}</p>
            </v-card-title>
            <v-card-text id="register_box">
              <v-layout row wrap>
                <v-flex md6>
                  <v-text-field
                    id="name"
                    v-model="name"
                    prepend-icon="fas fa-user"
                    :label="$t('user.auth.first_name')"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-text-field
                    class="pl-1"
                    id="surname"
                    v-model="surname"
                    :label="$t('user.auth.last_name')"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    id="email"
                    v-model="email"
                    prepend-icon="fas fa-envelope"
                    :label="$t('user.auth.email')"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-text-field
                    id="password"
                    v-model="password"
                    prepend-icon="fas fa-lock"
                    :label="$t('user.auth.pass')"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex md6>
                  <v-text-field
                    class="pl-1"
                    id="reppassword"
                    v-model="reppassword"
                    :label="$t('user.auth.repeat_pass')"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn flat class="primary--text" to="/signin">{{ $t('user.auth.login') }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="raven primary--text" @click="register_dialog=true">
                {{ $t('user.auth.register') }}
                <v-icon dark right>fas fa-user-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="register_dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Privacy Policy</v-card-title>
        <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click="register_dialog = false">{{ $t('user.auth.close') }}</v-btn>
          <v-btn color="primary" flat @click="registerUser">{{ $t('user.auth.accept') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirm_email_dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          <span>Validate email</span>
          <v-spacer></v-spacer>
          <v-btn icon flat class="my-0" @click="confirm_email_dialog=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>A email was sent in order to validate it. Only then you may use the system.</v-card-text>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      password: "",
      reppassword: "",
      register_dialog: false,
      confirm_email_dialog: false
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
      this.register_dialog = false;
      if (this.password === this.reppassword) {
        event_bus.$data.http
          .post("/register", {
            password: this.password,
            name: this.name + " " + this.surname,
            email: this.email
          })
          .then(response => {
            this.confirm_email_dialog = true;
            event_bus.$emit("waiting", false);
          })
          .catch(error => {
            if (error.response) {
              event_bus.$emit("toast", {
                message: error.response.data,
                type: "error"
              });
            } else {
              event_bus.$emit("toast", {
                message: error.message,
                type: "error"
              });
            }
            event_bus.$emit("waiting", false);
          });
      } else {
        event_bus.$emit("toast", {
          message: "the password doesn't match",
          type: "error"
        });
      }
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
    background-image: url("../../../assets/2.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
  }
}
@media only screen and (orientation: landscape) {
  #auth {
    background-image: url("../../../assets/1.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
  }
}
#auth_card {
  max-width: 400px;
}
</style>