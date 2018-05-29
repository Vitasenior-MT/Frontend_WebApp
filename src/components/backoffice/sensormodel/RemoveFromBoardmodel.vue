<template>
  <v-card id="remove_sensor">
    <v-card-title>
      <span class="headline error--text">Remove transducer from board model</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-text  v-if="sensor">Are you sure you want to remove the transducer "{{sensor.transducer}}-{{sensor.measure}}" from this board model "{{model.name}}"?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer><v-btn dark color="error darken-1" @click.native="removeItem">PROCEED</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "remove_sensor",
  props: {
    sensor: Object,
    model: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    removeItem() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .delete("/boardmodel/" + this.model.id + "/sensor", {
          data: {
            sensor_id: this.sensor.id
          }
        })
        .then(response => {
          this.$emit("remove");
          event_bus.$emit(
            "success",
            "transducer was successfully removed from board model"
          );
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("error", error.response.data);
          } else {
            event_bus.$emit("error", error.message);
          }
          event_bus.$emit("waiting", false);
        });
    }
  }
};
</script>
