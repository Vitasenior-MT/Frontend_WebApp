<template>
  <v-card-text id="patient_details" class="pt-0">
    <v-container grid-list-md>
      <v-layout row wrap style="height: 255px;">
        <v-flex xs12 md6>
          <h3 class="pl-3">Details</h3>
          <v-list class="py-0">
            <v-list-tile><v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">id</v-list-tile-sub-title>
                <v-list-tile-title>{{patient.id}}</v-list-tile-title>
            </v-list-tile-content></v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">activity status</v-list-tile-sub-title>
                <v-list-tile-title v-if="patient.active">enabled</v-list-tile-title>
                <v-list-tile-title v-else>disabled</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <disable-patient :box="$store.state.vitabox" :patient="patient"></disable-patient>
              </v-list-tile-action>
            </v-list-tile>
             <v-divider></v-divider>
             <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-bold">Boards</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <set-board-to-patient :patient="patient" @added="boardAdded"></set-board-to-patient>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>

          <br />
          <v-bottom-nav :active.sync="bottomNav" :value="true" shift v-if="this.patient.Boards.length>0">
            <v-btn flat v-for="board in this.patient.Boards" :key="board.id" @click.native="selectBoard(board)">
              <span>{{board.Boardmodel.name}}</span>
              <v-avatar tile size="26"><img :src="require('@/assets/'+board.Boardmodel.tag+'_icon.svg')"></v-avatar>
            </v-btn>
          </v-bottom-nav>
          <div v-else class="warning--text">This patient has no boards</div>
        </v-flex>

        <v-flex xs12 md6 v-if="board">
          <h3 class="pl-3">Sensors</h3>
          <v-list two-line class="py-0">
            <v-list-tile v-for="sensor in board.Sensors" :key="sensor.id" avatar ripple @click="()=>{}">
              <v-list-tile-content>
                <v-list-tile-title>{{sensor.Sensormodel.transducer}} - {{sensor.Sensormodel.measure}}</v-list-tile-title>
                <v-list-tile-sub-title>{{sensor.id}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{getTime(sensor.last_commit)}}</v-list-tile-action-text>
                <v-icon v-if="verifyDate(sensor.last_commit)" color="grey lighten-1">fas fa-exclamation-triangle</v-icon>
                <v-icon v-else color="yellow darken-2">fas fa-exclamation-triangle</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import PatientDisable from "@/components/backoffice/patient/PatientDisable.vue";
import SetBoardToPatient from "@/components/backoffice/board/SetToPatient.vue";

export default {
  name: "patient_details",
  props: {
    patient: Object
  },
  data: () => {
    return {
      board: null,
      bottomNav: 0
    };
  },
  mounted() {
    this.board = this.patient.Boards.length > 0 ? this.patient.Boards[0] : null;
  },
  methods: {
    getTime(date) {
      let miliseconds = new Date() - new Date(date);
      if (miliseconds < 1000) return "<1 sec";
      else if (miliseconds < 60000) {
        return "~" + Math.floor(miliseconds / 1000) + " sec";
      } else if (miliseconds < 3600000) {
        return "~" + Math.floor(miliseconds / 60000) + " min";
      } else if (miliseconds < 86400000) {
        return Math.floor(miliseconds / 3600000) + " hours";
      } else return ">24 hours";
    },
    selectBoard(board) {
      this.board = board;
    },
    boardAdded(board) {
      this.patient.Boards.push(board);
    },
    verifyDate(date) {
      return new Date() - new Date(date) < 86400000;
    }
  },
  components: {
    "disable-patient": PatientDisable,
    "set-board-to-patient": SetBoardToPatient
  }
};
</script>

<style>
#dashboard_patient_div {
  position: relative;
  width: 100%;
}
#dashboard_patient_icon {
  position: absolute;
  right: 0;
}

/* #add_board_to_patient_header {
  position: relative;
  display: inline;
}
#add_board_to_patient_icon {
  position: absolute;
  right: 0;
} */
</style>