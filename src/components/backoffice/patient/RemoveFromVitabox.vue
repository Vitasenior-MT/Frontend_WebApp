<template>
  <v-card id="remove_patient">
    <v-card-title>
      <span class="headline error--text">Remove patient from vitabox</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-text  v-if="patient">Are you sure you want to remove the patient "{{patient.name}}" from this vitabox?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer><v-btn dark color="error darken-1" block @click.native="removeItem">PROCEED</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "remove_patient",
  props: {
    box: Object,
    patient: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    removeItem() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .delete("/vitabox/" + this.box.id + "/patient", {
          data: {
            patient_id: this.patient.id
          }
        })
        .then(response => {
          this.$emit("remove");
          event_bus.$emit("toast", {
            message: "patient was successfully removed from vitabox",
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
          event_bus.$emit("waiting", false);
        });
    }
  }
};
</script>