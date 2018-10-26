<template>
    <v-container class="pa-1" dark grid-list text-xs-center v-if="sensors.length > 0 && sensors[0].sensor">
      <v-flex class="pa-1">
        <v-layout row :class="(avg <= sensors[0].sensor.Sensormodel.min_acceptable || avg >= sensors[0].sensor.Sensormodel.max_acceptable) ? 'red darken-4':'green darken-4'">
          <v-flex xs4 sm3 md3 class="pa-0" style="position:relative">
            <img v-if="type == 'temp'" src="@/assets/temp_icon.svg" class="envIcon">
            <img v-if="type == 'humi'" src="@/assets/humi_icon.svg" class="envIcon">
            <img v-if="type == 'mono'" src="@/assets/mono_icon.svg" class="envIcon">
            <img v-if="type == 'diox'" src="@/assets/diox_icon.svg" class="envIcon">
          </v-flex>
          <v-flex xs8 sm9 md9 class="pa-0">  
            <v-card-title primary-title :class="(avg <= sensors[0].sensor.Sensormodel.min_acceptable || avg >= sensors[0].sensor.Sensormodel.max_acceptable) ? 'red darken-1':'green darken-1'">
              <div>
                <div class="headline">{{ avg >-1 ? avg : 'none' }}</div>
                <div>{{ metric }}</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-layout row wrap>
        <v-flex v-for="item in sensors" :key="item.id" class="pa-1" >
          <div v-if="item.sensor">
            <v-card class="vitaboxBoardSelector red darken-1" @click.native="goToBoardDetails(item.board, item.sensor)" v-if="!item.sensor.last_values || item.sensor.last_values[item.sensor.last_values.length-1] <= item.sensor.Sensormodel.min_acceptable || item.sensor.last_values[0] >= item.sensor.Sensormodel.max_acceptable">
              <v-card-title primary class="title">{{ item.sensor.last_values ? item.sensor.last_values[0]:'none' }}</v-card-title>
              <v-card-text primary>{{ item.board.description }}</v-card-text>
            </v-card>
            <v-card class="vitaboxBoardSelector green darken-1" @click.native="goToBoardDetails(item.board, item.sensor)" v-else>
              <v-card-title primary class="title">{{ item.sensor.last_values ? item.sensor.last_values[0]:'none' }}</v-card-title>
              <v-card-text primary>{{ item.board.description }}</v-card-text>
            </v-card> 
          </div> 
        </v-flex> 
      </v-layout> 
    </v-container> 
</template>


<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "envBoardDashboard",
  data: () => {
    return {
      avg: 0,
      metric: ""
    };
  },
  props: {
    sensors: Array,
    type: String
  },
  watch: {
    sensors(x) {
      if (x.length > 0) {
        let sum = 0,
          count = 0;
        this.sensors.forEach(x => {
          if (x.sensor.last_values && x.sensor.last_values.length > 0) {
            sum += x.sensor.last_values[0];
            count++;
          }
        });
        if (count === 0) this.avg = -1;
        else this.avg = Math.round(sum/count);
        this.metric =
          this.sensors[0].sensor.Sensormodel.measure +
          " (" +
          this.sensors[0].sensor.Sensormodel.unit +
          ")";
      }
    }
  },
  methods: {
    goToBoardDetails(boardData, sensorData) {
      this.$store.commit("setBoardData", boardData);
      this.$store.commit("setSensorData", sensorData);
      this.$router.push("/frontoffice/board/detail");
    }
  }
};
</script>

<style>
.envIcon {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50%;
  bottom: 50%;
  transform: translate(-50%, -50%);
}

.vitaboxBoardSelector {
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 5px #000000;
}

.vitaboxBoardSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}
</style>
