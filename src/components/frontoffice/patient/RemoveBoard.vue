<template>
  <div id="remove_board_from_patient">
    <v-tooltip bottom>
      <v-btn slot="activator" flat icon small color="error" @click.native="()=>dialog_remove_board=true">
        <v-icon>fas fa-minus-circle</v-icon>
      </v-btn>
      <span>{{ $t("frontoffice.patient.remove_board_tooltip") }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog_remove_board" max-width="500px">
      <v-card>
        <v-card-title>
          <span
            class="headline error--text"
          >{{$t('frontoffice.patient.remove')}} {{board.Boardmodel.name}}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_remove_board=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="board">
          {{$t('frontoffice.patient.remove_board_text')}}
          <v-checkbox
            :label="$t('frontoffice.patient.remove_confirm')"
            v-model="checked"
            color="raven"
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!checked" block disabled>{{$t('frontoffice.patient.submit')}}</v-btn>
          <v-btn
            dark
            v-else
            color="error darken-1"
            block
            @click.native="removeItem"
          >{{$t('frontoffice.patient.submit')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "remove_board_from_patient",
  props: {
    board: Object
  },
  data: () => {
    return {
      dialog_remove_board: false,
      checked: false
    };
  },
  methods: {
    removeItem() {
      event_bus.$emit("waiting", true);
      this.dialog_remove_board = false;

      event_bus.$data.http
        .delete("/board/" + this.board.id + "/patient", {
          data: {
            patient_id: this.$store.state.patient.id
          }
        })
        .then(response => {
          this.$store.commit("removeBoardPatient", this.board);

          event_bus.$emit("toast", {
            message: "board was successfully removed from patient",
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