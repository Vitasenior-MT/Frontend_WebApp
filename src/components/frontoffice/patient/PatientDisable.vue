<template>
  <div id="disable_patient">
    <v-btn icon small color="transparent" @click.native="()=>dialog_disable_patient=true">
      <v-icon v-if="patient.active">fas fa-play-circle</v-icon>
      <v-icon v-else>fas fa-pause-circle</v-icon>
    </v-btn>
    <v-dialog v-model="dialog_disable_patient" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline warning--text">Switch patient activity</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_disable_patient=false"><v-icon color="error">fas fa-times</v-icon></v-btn>
        </v-card-title>
        <v-card-text  v-if="patient">Are you sure you want to switch the patient activity from this vitabox?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer><v-btn dark color="warning darken-1" block @click.native="switchActivity">PROCEED</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "disable_patient",
  props: {
    box: Object,
    patient: Object
  },
  data: () => {
    return {
      dialog_disable_patient: false
    };
  },
  methods: {
    switchActivity() {
      event_bus.$emit("waiting", true);
      this.dialog_disable_patient = false;

      event_bus.$data.http
        .put(
          "/vitabox/" +
            this.box.id +
            "/patient/" +
            (this.patient.active ? "disable" : "enable"),
          {
            patient_id: this.patient.id
          }
        )
        .then(response => {
          this.patient.active = !this.patient.active;
          event_bus.$emit("toast", {
            message: "patient status was successfully changed",
            type: "success"
          });
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
    }
  }
};
</script>