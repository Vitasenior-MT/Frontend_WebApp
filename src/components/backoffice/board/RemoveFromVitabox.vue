<template>
  <v-card id="remove_board">
    <v-card-title>
      <span class="headline error--text">Remove board from vitabox</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-text  v-if="board">Are you sure you want to remove the board from this vitabox?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer><v-btn dark color="error darken-1" block @click.native="removeItem">PROCEED</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "remove_board",
  props: {
    box: Object,
    board: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    removeItem() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .delete("/vitabox/" + this.box.id + "/board", {
          data: {
            board_id: this.board.id
          }
        })
        .then(response => {
          this.$emit("remove");
          event_bus.$emit("toast", {
            message: "board was successfully removed from vitabox",
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