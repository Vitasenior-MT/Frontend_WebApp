<template>
  <div id="disable_patient">

    <v-tooltip bottom v-if="patient.active">
      <v-btn slot="activator" icon small color="transparent" @click.native="()=>dialog_disable_patient=true">
        <v-icon>fas fa-play-circle</v-icon>
      </v-btn>
      <span>active</span>
    </v-tooltip>
    <v-tooltip bottom v-else-if="!patient.active && !patient.weight && !patient.height">
      <v-icon slot="activator" dark>fas fa-sync-alt</v-icon>
      <span>waiting for the doctor to start activity</span>
    </v-tooltip>
    <v-tooltip bottom v-else>
      <v-btn slot="activator" icon small color="transparent" @click.native="()=>dialog_disable_patient=true">
        <v-icon>fas fa-pause-circle</v-icon>
      </v-btn>
      <span>paused activity</span>
    </v-tooltip>

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
      this.dialog_disable_patient = false;
      if (this.patient.weight && this.patient.height) {
        event_bus.$emit("waiting", true);
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
      } else {
        event_bus.$emit("toast", {
          message:
            "patient can't be activated while doctor doesn't define weight and height",
          type: "error"
        });
      }
    }
  }
};
</script>