<template>
  <div id="get_warnings_board">
    <v-btn icon small color="transparent" @click.native="()=>dialog_warning_board=true">
      <v-icon v-if="board.get_warnings">fas fa-play-circle</v-icon>
      <v-icon v-else>fas fa-pause-circle</v-icon>
    </v-btn>
    <v-dialog v-model="dialog_warning_board" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline warning--text">Switch warning reception</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_warning_board=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text
          v-if="board"
        >Are you sure you want to switch the warning reception from this board?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="warning darken-1" block @click.native="switchActivity">PROCEED</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "get_warnings_board",
  props: {
    board: Object
  },
  data: () => {
    return {
      dialog_warning_board: false
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    switchActivity() {
      event_bus.$emit("waiting", true);
      this.dialog_warning_board = false;

      event_bus.$data.http
        .put("/board/" + this.board.id + "/warnings", {
          flag: !this.board.get_warnings
        })
        .then(response => {
          this.board.get_warnings = !this.board.get_warnings;
          event_bus.$emit("toast", {
            message: "board warning reception was successfully changed",
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