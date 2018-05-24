<template>
 <div id="login">
    <img src="/static/img/icons/android-chrome-192x192.png" class="center-block logo">

    <div class="text-center col-sm-12">
      <!-- login form -->
      <v-form @submit.prevent="checkCreds">
        <div class="input-group">
          <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
          <v-text-field class="form-control" name="email" placeholder="Email" type="text" v-model="email" required></v-text-field>
        </div>

        <div class="input-group">
          <span class="input-group-addon"><i class="fa fa-lock"></i></span>
          <v-text-field class="form-control" name="password" placeholder="Password" type="password" v-model="password" required></v-text-field>
        </div>
        <v-btn type="submit" @click='login' v-bind:class="'btn btn-primary btn-lg ' + loading">Submit</v-btn>
      </v-form>

      <!-- errors -->
      <div v-if=response class="text-red"><p class="vertical-5p lead">{{response}}</p></div>
    </div>
    <!-- <a @click="$router.go(-1)">back</a>-->
  </div>   
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  name: 'Signin',
  data(router) {
    return {
      section: 'Signin',
      loading: '',
      response: '',
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
    },
    checkCreds() {
      const { username, password } = this;

      this.toggleLoading();
      this.resetResponse();
      this.$store.commit("TOGGLE_LOADING");

      /* Making API call to authenticate a user */
      event_bus.$data.http
        .post("/login", { password: this.password, email: this.email })
        .then(response => {
          this.toggleLoading();

          var data = response.data;
          /* Checking if error object was returned from the server */
          if (data.error) {
            var errorName = data.error.name;
            if (errorName) {
              this.response =
                errorName === "InvalidCredentialsError"
                  ? "Username/Password incorrect. Please try again."
                  : errorName;
            } else {
              this.response = data.error;
            }

            return;
          }

          /* Setting user in the state and caching record to the localStorage */
          if (data.user) {
            var token = "Bearer " + data.token;

            this.$store.commit("SET_USER", data.user);
            this.$store.commit("SET_TOKEN", token);

            if (window.localStorage) {
              window.localStorage.setItem("user", JSON.stringify(data.user));
              window.localStorage.setItem("token", token);
            }

            this.$router.push(data.redirect ? data.redirect : "/");
          }
        })
        .catch(error => {
          this.$store.commit("TOGGLE_LOADING");
          console.log(error);

          this.response = "Server appears to be offline";
          this.toggleLoading();
        });
    },
    toggleLoading() {
      this.loading = this.loading === "" ? "loading" : "";
    },
    resetResponse() {
      this.response = "";
    }
  }
};
</script>

<style>
#login {
  padding: 10em;
}

</style>
