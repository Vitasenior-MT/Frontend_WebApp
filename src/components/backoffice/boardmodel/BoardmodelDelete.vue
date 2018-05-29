<template>
  <v-card id="delete_model">
    <v-card-title>
      <span class="headline error--text">Delete board model</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-text  v-if="item">Are you sure you want to delete this board model "{{item.name}}"?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer><v-btn dark color="error darken-1" @click.native="deleteItem">PROCEED</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "delete_model",
  props: {
    item: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    deleteItem() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .delete("/boardmodel/" + this.item.id)
        .then(response => {
          this.$emit("delete");
          event_bus.$emit("toast", {
            message: "board model was successfully removed",
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

