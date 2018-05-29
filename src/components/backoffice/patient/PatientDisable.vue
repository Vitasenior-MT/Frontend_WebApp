<template>
  <v-card id="disable_patient">
    <v-card-title>
      <span class="headline warning--text">Switch patient activity</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-text  v-if="patient">Are you sure you want to switch the patient activity from this vitabox?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer><v-btn dark color="warning darken-1" block @click.native="switchActivity">PROCEED</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "disable_patient",
  props: {
    box: Object,
    patient: Object,
    action: String
  },
  methods: {
    close() {
      this.$emit("close");
    },
    switchActivity() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .put("/vitabox/" + this.box.id + "/patient/" + this.action, {
          patient_id: this.patient.id
        })
        .then(response => {
          this.$emit("disable");
          event_bus.$emit("toast", {
            message: "patient status was successfully changed",
            type: "success"
          });
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
          event_bus.$emit("waiting", true);
        });
    }
  }
};
</script>