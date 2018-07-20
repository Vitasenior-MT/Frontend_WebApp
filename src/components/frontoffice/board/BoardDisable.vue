<template>
  <div id="disable_board">
    <v-btn icon small color="transparent" @click.native="()=>dialog_disable_board=true">
      <v-icon v-if="board.active">fas fa-play-circle</v-icon>
      <v-icon v-else>fas fa-pause-circle</v-icon>
    </v-btn>
    <v-dialog v-model="dialog_disable_board" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline warning--text">Switch board activity</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_disable_board=false"><v-icon color="error">fas fa-times</v-icon></v-btn>
        </v-card-title>
        <v-card-text  v-if="board">Are you sure you want to switch the board activity from this vitabox?</v-card-text>
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
  name: "disable_board",
  props: {
    box: Object,
    board: Object
  },
  data: () => {
    return {
      dialog_disable_board: false
    };
  },
  methods: {
    switchActivity() {
      event_bus.$emit("waiting", true);
      this.dialog_disable_board = false;

      event_bus.$data.http
        .put(
          "/vitabox/" +
            this.box.id +
            "/board/" +
            (this.board.active ? "disable" : "enable"),
          {
            board_id: this.board.id
          }
        )
        .then(response => {
          this.board.active = !this.board.active;
          event_bus.$emit("toast", {
            message: "board status was successfully changed",
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
          event_bus.$emit("waiting", true);
        });
    }
  }
};
</script>