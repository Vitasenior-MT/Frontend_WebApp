<template>
  <v-card-text class="pt-0">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 md6>
          <h3 class="pl-3">Details</h3>
          <v-list class="py-0">
            <v-list-tile><v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">id</v-list-tile-sub-title>
                <v-list-tile-title>{{board.id}}</v-list-tile-title>
            </v-list-tile-content></v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">mac address</v-list-tile-sub-title>
                <v-list-tile-title>{{board.mac_addr}}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                  <exchange-board :board="board" @exchange="(new_mac)=>{board.mac_addr=new_mac}"></exchange-board>
                </v-list-tile-action>
              </v-list-tile>
            <v-list-tile><v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">type</v-list-tile-sub-title>
                <v-list-tile-title>{{board.Boardmodel.type}}</v-list-tile-title>
            </v-list-tile-content></v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">activity status</v-list-tile-sub-title>
                <v-list-tile-title v-if="board.active">enabled</v-list-tile-title>
                <v-list-tile-title v-else>disabled</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <disable-board :box="$store.state.vitabox" :board="board"></disable-board>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile><v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">last commit</v-list-tile-sub-title>
                <v-list-tile-title>{{getTime(last_commit)}}</v-list-tile-title>
            </v-list-tile-content></v-list-tile>
            <v-list-tile><v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">last configuration</v-list-tile-sub-title>
                <v-list-tile-title>{{formatDate(board.updated_at)}}</v-list-tile-title>
            </v-list-tile-content></v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="primary_l--text caption">vitabox</v-list-tile-sub-title>
                <v-list-tile-title>{{this.$store.state.vitabox.address}}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <remove-board :box="$store.state.vitabox" :board="board" @remove="remove"></remove-board>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-flex>

        <v-flex xs12 md6>
          <h3 class="pl-3">Sensors</h3>
          <v-list two-line class="py-0" v-if="board.Sensors.length>0">
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

          <div v-else>There is no Board sensors</div>
        </v-flex>
      </v-layout>
    </v-container>
    
  </v-card-text>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import BoardDisable from "@/components/backoffice/board/BoardDisable.vue";
import BoardRemove from "@/components/backoffice/board/BoardRemove.vue";
import BoardExchange from "@/components/backoffice/board/BoardExchange.vue";

export default {
  name: "dashboard_board",
  props: {
    board: Object
  },
  data: () => {
    return {
      last_commit: null,
      selected_sensor: null
    };
  },
  mounted() {
    this.selected_sensor =
      this.board.Sensors.length > 0 ? this.board.Sensors[0] : null;
  },
  methods: {
    formatDate(date) {
      let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      let d = new Date(date);
      return (
        d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear()
      );
    },
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
    verifyDate(date) {
      return new Date() - new Date(date) < 86400000;
    },
    remove(board) {
      this.$emit("remove");
    }
  },
  components: {
    "disable-board": BoardDisable,
    "remove-board": BoardRemove,
    "exchange-board": BoardExchange
  }
};
</script>

<style>
.column {
  white-space: nowrap;
}
.last-column {
  width: 100%;
}
</style>


