<template>
  <v-content v-if="board">
    <v-card>
      <v-card-title class="pb-0">
        <p class="headline">{{board.Boardmodel.name}} - {{board.description}}</p>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <table style="width:100%">
                <tr>
                  <td class="text-xs-right column"><label class="primary_d--text mx-2">id</label></td>
                  <th class="text-xs-left last-column" colspan="2">{{board.id}}</th>
                </tr>
                <tr>
                  <td class="text-xs-right column"><label class="primary_d--text mx-2">mac address</label></td>
                  <th class="text-xs-left last-column" colspan="2"><label>{{board.mac_addr}}</label></th>
                </tr>
                <tr>
                  <td class="text-xs-right column"><label class="primary_d--text mx-2">type</label></td>
                  <th class="text-xs-left last-column" colspan="2"><label>{{board.Boardmodel.type}}</label></th>
                </tr>
                <tr>
                  <td class="text-xs-right column"><label class="primary_d--text mx-2">vitabox</label></td>
                  <th class="text-xs-left column"><label>{{box.address}}</label></th>
                  <td class="text-xs-right last-column">
                    <v-btn flat icon small color="error" @click.native="()=>dialog_remove_board=true"><v-icon>fas fa-minus-circle</v-icon></v-btn>
                  </td>
                </tr>
              </table>
            </v-flex>
            <v-flex xs12 md6>
              <table style="width:100%">
                <tr>
                  <td class="text-xs-right column"><label class="primary_d--text mx-2">activity status</label></td>
                  <td class="text-xs-left last-column">
                    <label v-if="board.active" class="success--text">enabled</label>
                    <label v-else class="error--text">disabled</label>
                  </td>
                  <td class="text-xs-right column">
                    <v-btn icon small color="transparent" @click.native="()=>dialog_disable_board=true">
                      <v-icon v-if="board.active">fas fa-pause-circle</v-icon>
                      <v-icon v-else>fas fa-play-circle</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr>
                  <td class="text-xs-right column"><label class="primary_d--text mx-2">last commit</label></td>
                  <th class="text-xs-left last-column"><label>{{getTime(last_commit)}}</label></th>
                </tr>
                <tr>
                  <td class="text-xs-right column"><label class="primary_d--text mx-2">last configuration</label></td>
                  <td class="text-xs-left last-column" colspan="2"><label>{{formatDate(board.updated_at)}}</label></td>
                </tr>
              </table>
            </v-flex>
          </v-layout>
        </v-container>
        <div v-if="selected_sensor">
          <v-tabs centered grow slider-color="primary_d" color="primary" v-model="selected_sensor" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left">
            <v-tab v-for="sensor in sensors" :key="sensor.id" :href="`#tab-${sensor.id}`">
              <label>{{sensor.Sensormodel.transducer}} - {{sensor.Sensormodel.measure}}</label>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="selected_sensor">
            <v-tab-item v-for="sensor in sensors" :key="sensor.id" :id="`tab-${sensor.id}`">
              <sensor-graph :sensor="sensor"></sensor-graph>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog_remove_board" max-width="500px">
      <remove-board-from-vitabox @close="()=>dialog_remove_board=false" @remove="remove" :board="board" :box="box"></remove-board-from-vitabox>
    </v-dialog>
    <v-dialog v-model="dialog_disable_board" max-width="500px">
      <disable-board @close="()=>dialog_disable_board=false" @disable="disable" :board="board" :box="box" :action="board.active?'disable':'enable'"></disable-board>
    </v-dialog>

  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SensorBoard from "@/components/backoffice/sensor/SensorFromBoard.vue";
import RemoveBoard from "@/components/backoffice/board/RemoveFromVitabox.vue";
import DisableBoard from "@/components/backoffice/board/BoardDisable.vue";

export default {
  name: "dashboard_board",
  props: {
    board: Object,
    box: Object
  },
  data: () => {
    return {
      sensors: [],
      dialog_remove_board: false,
      dialog_disable_board: false,
      interval: null,
      last_commit: null,
      selected_sensor: null
    };
  },
  mounted() {
    if (this.board) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/board/" + this.board.id + "/sensor")
        .then(response => {
          this.sensors = response.data.sensors;
          this.selected_sensor = "tab-" + response.data.sensors[0].id;
          this.last_commit = this.sensors.reduce(
            (last, current) =>
              current.datetime > last ? current.datetime : last
          );
          event_bus.$emit("waiting", false);
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", { message: error.message, type: "error" });
          }
          event_bus.$emit("waiting", false);
        });
      this.warning();
    } else {
      event_bus.$emit("toast", { message: "Board undefined", type: "error" });
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
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
    remove() {
      this.dialog_remove_board = false;
      this.$router.push("/vitabox/list");
      event_bus.$emit("waiting", false);
    },
    disable() {
      this.dialog_disable_board = false;
      this.board.active = !this.board.active;
      event_bus.$emit("waiting", false);
    }
  },
  components: {
    "sensor-graph": SensorBoard,
    "remove-board-from-vitabox": RemoveBoard,
    "disable-board": DisableBoard
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


