<template>
  <div id="disable_board">
    <v-tooltip bottom>
      <v-btn
        slot="activator"
        icon
        small
        color="transparent"
        @click.native="()=>dialog_disable_warning=true"
      >
        <v-icon v-if="board.get_warnings">fas fa-play-circle</v-icon>
        <v-icon v-else>fas fa-pause-circle</v-icon>
      </v-btn>
      <span>{{board.get_warnings?$t('frontoffice.board.active'):$t('frontoffice.board.inactive')}}</span>
    </v-tooltip>
    <v-dialog v-model="dialog_disable_warning" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline warning--text">{{ $t('frontoffice.board.switch_warnings') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_disable_warning=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="board">{{ $t('frontoffice.board.warning_confirm') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="warning darken-1"
            block
            @click.native="switchActivity"
          >{{ $t('frontoffice.board.submit') }}</v-btn>
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
    board: Object
  },
  data: () => {
    return {
      dialog_disable_warning: false
    };
  },
  methods: {
    switchActivity() {
      event_bus.$emit("waiting", true);
      this.dialog_disable_warning = false;

      event_bus.$data.http
        .put("/board/" + this.board.id + "/warnings", {
          flag: !this.board.get_warnings
        })
        .then(response => {
          this.board.get_warnings = !this.board.get_warnings;
          event_bus.$emit("toast", {
            message: "board warnings was successfully switched",
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