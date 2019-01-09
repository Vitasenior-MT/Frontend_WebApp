<template>
  <div id="update_board">
    <v-btn icon small color="transparent" @click.native="()=>dialog_update_board=true">
      <v-icon color="teal darken-2">fas fa-edit</v-icon>
    </v-btn>
    <v-dialog v-model="dialog_update_board" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline warning--text">Switch board activity</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_update_board=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="board">
          <v-text-field label="new description" v-model="new_description"></v-text-field>
        </v-card-text>
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
  name: "update_board",
  props: {
    board: Object
  },
  data: () => {
    return {
      dialog_update_board: false,
      new_description: ""
    };
  },
  created() {
    this.new_description = this.board.description;
  },
  methods: {
    switchActivity() {
      event_bus.$emit("waiting", true);
      this.dialog_update_board = false;

      event_bus.$data.http
        .put("/board/" + this.board.id, {
          description: this.new_description
        })
        .then(response => {
          this.board.description = this.new_description;
          event_bus.$emit("toast", {
            message: "board description was successfully updated",
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