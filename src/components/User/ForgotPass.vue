<template>
  <v-stepper v-model="step" id="forgot">
    <v-stepper-header>
      <v-stepper-step step="1" :complete="step > 1">Forgot password</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="step > 2">Reset Password</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items style="height:308px !important;">
      <v-stepper-content step="1">
        <v-card-text class="mb-3">
          <p class="subheading">Please insert your email.</p>
          <v-form>
            <v-text-field prepend-icon="email" v-model="forgot_email" name="email" label="Email" id="forgot_email" type="text"></v-text-field>
          </v-form>
          <p class="mb-5">You'll receive a code that will be valid for 1 hour to reset your password.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="raven primary--text" @click.native="forgot">Send</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat class="primary--text" @click.native="close">Cancel</v-btn>
        </v-card-actions>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card-text>
          <v-form>
            <v-text-field prepend-icon="vpn_key" v-model="token" name="token" label="Code" id="token" type="text"></v-text-field>
            <v-text-field prepend-icon="lock" v-model="new_password" name="new_password" label="Password" id="new_password" type="password"></v-text-field>
            <v-text-field prepend-icon="lock" v-model="confirm_password" :rules="[() => confirm_password === new_password || 'Password don\'t match']" name="confirm_password" label="Confirm password" id="confirm_password" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="raven primary--text" @click.native="reset">Submit</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat class="primary--text" @click.native="close">Cancel</v-btn>
        </v-card-actions>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
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
  methods: {
    forgot() {
      event_bus.$emit("waiting", 50);
      event_bus.$data.http
        .post("/forgot", { email: this.forgot_email })
        .then(response => {
          this.step = 2;
          event_bus.$emit("waiting", 50);
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
          event_bus.$emit("waiting", 50);
        });
    },
    reset() {
      event_bus.$emit("waiting", 50);
      event_bus.$data.http
        .post("/reset", { password: this.new_password, token: this.token })
        .then(response => {
          this.step = 2;
          event_bus.$emit("waiting", 50);
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
          event_bus.$emit("waiting", 50);
        });
    },
    close() {
      this.$emit("close");
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
</style>