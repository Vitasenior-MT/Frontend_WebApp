<template>
  <v-card id="vitabox_reset">
    <v-card-title>
      <span class="headline error--text">Reset vitabox</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text
      v-if="vitabox"
    >Reseting the board will remove all associations to users, patients and equipment as well as generating a new password.
      <v-checkbox label="Are you sure?" v-model="checked" color="raven"></v-checkbox>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="!checked" block disabled>PROCEED</v-btn>
      <v-btn dark v-else color="error darken-1" block @click.native="reset">PROCEED</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "vitabox_reset",
  props: {
    vitabox: Object
  },
  data: () => {
    return {
      checked: false
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    reset() {
      event_bus.$emit("waiting", true);

      event_bus.$data.http
        .put("/vitabox/" + this.vitabox.id + "/reset", {})
        .then(response => {
          this.$emit("reseted");
          this.close();
          event_bus.$emit("toast", {
            message: "vitabox was successfully reseted",
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

<style>
</style>
