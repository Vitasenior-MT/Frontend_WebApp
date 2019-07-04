<template>
  <v-content id="auth">
    <v-container fill-height>
      <v-layout justify-center wrap align-center class="pb-5 mb-5">
        <v-flex id="auth_card">
          <v-card id="forgot">
            <v-stepper v-model="step">
              <v-stepper-header>
                <v-stepper-step step="1">{{ $t('user.auth.forgot') }}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">{{ $t('user.auth.reset') }}</v-stepper-step>
              </v-stepper-header>
              <v-stepper-items style="height:308px !important;">
                <v-stepper-content step="1" class="px-1">
                  <v-card-text class="pb-3">
                    <p class="subheading">{{ $t('user.auth.forgot_title') }}</p>
                    <v-form>
                      <v-text-field
                        prepend-icon="fas fa-envelope"
                        v-model="forgot_email"
                        name="email"
                        :label="$t('user.auth.email')"
                        id="forgot_email"
                        type="text"
                      ></v-text-field>
                    </v-form>
                    <p class="mb-5">{{ $t('user.auth.forgot_text') }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn flat class="primary--text" to="/signin">{{ $t('user.auth.login') }}</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="raven primary--text" @click.native="forgot">
                      {{ $t('user.auth.send') }}
                      <v-icon dark right>fas fa-share-square</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-stepper-content>
                <v-stepper-content step="2" class="px-1">
                  <v-card-text class="pb-1">
                    <v-form>
                      <v-text-field
                        prepend-icon="fas fa-key"
                        v-model="token"
                        name="token"
                        :label="$t('user.auth.code')"
                        id="token"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="fas fa-lock"
                        v-model="new_password"
                        name="new_password"
                        :label="$t('user.auth.new_pass')"
                        id="new_password"
                        type="password"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="fas fa-lock"
                        v-model="confirm_password"
                        :rules="[() => confirm_password === new_password || 'Password don\'t match']"
                        name="confirm_password"
                        :label="$t('user.auth.confirm_pass')"
                        id="confirm_password"
                        type="password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="raven primary--text" @click.native="reset">
                      {{ $t('user.auth.submit') }}
                      <v-icon dark right>fas fa-external-link-alt</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "forgot",
  data: () => {
    return {
      forgot_email: "",
      new_password: "",
      confirm_password: "",
      token: "",
      step: 1,
      success_msg: ""
    };
  },
  mounted() {
    this.$el.addEventListener("keypress", event => {
      if (event.key == "Enter")
        if (this.step === 1) this.forgot();
        else this.reset();
    });
  },
  beforeDestroy() {
    this.$el.removeEventListener("keypress", event => {
      if (event.key == "Enter")
        if (this.step === 1) this.forgot();
        else this.reset();
    });
  },
  methods: {
    forgot() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .post("/forgot", { email: this.forgot_email })
        .then(response => {
          this.step = 2;
          event_bus.$emit("waiting", false);
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
    reset() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .post("/reset", { password: this.new_password, token: this.token })
        .then(response => {
          this.step = 2;
          event_bus.$emit("waiting", false);
          event_bus.$emit("toast", {
            message: "password successfully restored",
            type: "success"
          });
          this.$router.push("/signin");
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
#forgot {
  height: 380px !important;
}
.stepper__content {
  padding: 0;
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
