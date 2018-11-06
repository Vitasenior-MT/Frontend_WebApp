<template>
    <v-container class="pa-1" dark grid-list text-xs-center v-if="sensors.length > 0 && sensors[0].sensor">
      <v-flex>
        <v-card class="pa-1" :class="(avg <= sensors[0].sensor.Sensormodel.min_acceptable || avg >= sensors[0].sensor.Sensormodel.max_acceptable) ? 'red':'green'">
          <v-card-title class="px-0 py-2">
            <v-layout row wrap>
              <v-flex xs12 md3 class="pa-0 iconBox">
                <img :src="require('@/assets/'+type+'_icon.svg')" class="envIcon">
              </v-flex>
              <v-flex xs12 md9 class="pa-0">
                    <div class="headline">{{ avg >-1 ? avg : 'none' }}</div>
                    <div>{{ metric }}</div>
              </v-flex>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-layout row wrap>
        <v-flex v-for="item in sensors" :key="item.id" class="pa-1" >
          <div v-if="item.sensor">
            <v-card @click.native="goToBoardDetails(item.sensor, item.board)" class="darken-3 vitaboxBoardSelector" :class="(!item.sensor.last_values || item.sensor.last_values[item.sensor.last_values.length-1] <= item.sensor.Sensormodel.min_acceptable || item.sensor.last_values[0] >= item.sensor.Sensormodel.max_acceptable)?'red':'green'">
              <v-card-text primary class="px-1">
                <p class="mb-1 title">{{ item.sensor.last_values ? item.sensor.last_values[0]:'none' }}</p>
                {{ item.board.description }}
                </v-card-text>
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
        else this.avg = Math.round(sum / count);
        this.metric =
          this.sensors[0].sensor.Sensormodel.measure +
          " (" +
          this.sensors[0].sensor.Sensormodel.unit +
          ")";
      }
    }
  },
  methods: {
    goToBoardDetails(sensor, board) {
      this.$router.push({
        name: "FOSensorDetail",
        params: { sensor: sensor, board: board }
      });
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
.iconBox{
  min-width: 40px;
  min-height: 40px;
  position: relative;
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
