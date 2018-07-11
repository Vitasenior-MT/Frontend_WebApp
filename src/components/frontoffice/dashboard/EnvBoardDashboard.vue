<template>
    <v-container class="pt-1 pl-1 pr-1" dark grid-list text-xs-center v-if="sensors.length > 0 && sensors[0].sensor">
      <v-flex class="pa-1" v-if="getAverageValue() <= sensors[0].sensor.Sensormodel.min_acceptable || getAverageValue() >= sensors[0].sensor.Sensormodel.max_acceptable">
        <v-layout row >
          <v-flex xs4 sm3 md3 class="pa-0">  
            <v-card class="pr-0 red darken-4" height="100%">
              <v-avatar class="envIcon">
                <img v-if="type == 'temperatura (ºC)'" src="@/assets/temp_icon.svg">
                <img v-if="type == 'humidade (%)'" src="@/assets/humi_icon.svg">
                <img v-if="type == 'monox. carbono (ppm)'" src="@/assets/mono_icon.svg">
                <img v-if="type == 'dioxi. carbono (ppm)'" src="@/assets/dioxi_icon.svg">
              </v-avatar>
            </v-card>
          </v-flex>
          <v-flex xs8 sm9 md9 class="pa-0">  
            <v-card class="pl-0 red darken-1">
              <v-card-text class="title text-md-center">{{ getAverageValue() }}</v-card-text>
              <v-card-text primary>{{ type }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex class="pa-1" v-else>
        <v-layout row>
          <v-flex xs4 sm3 md3 class="pa-0"> 
            <v-card class="pr-0 green darken-4" height="100%">
              <v-avatar class="envIcon">
                <img v-if="type == 'temperatura (ºC)'" src="@/assets/temp_icon.svg">
                <img v-if="type == 'humidade (%)'" src="@/assets/humi_icon.svg">
                <img v-if="type == 'monox. carbono (ppm)'" src="@/assets/mono_icon.svg">
                <img v-if="type == 'dioxi. carbono (ppm)'" src="@/assets/dioxi_icon.svg">
              </v-avatar>
            </v-card>
          </v-flex>
          <v-flex xs8 sm9 md9 style="padding:0px">  
            <v-card class="green darken-1" style="padding-left:0p">
              <v-card-text headline class="text-md-center">{{ getAverageValue() }}</v-card-text>
              <v-card-text primary>{{ type }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-layout row wrap>
        <v-flex v-for="item in sensors" :key="item.id" class="pa-1" >
          <div v-if="item.sensor">
            <v-card class="vitaboxBoardSelector red darken-1" @click.native="goToBoardDetails(item.board, item.sensor)" v-if="!item.sensor.last_values || item.sensor.last_values[item.sensor.last_values.length-1] <= item.sensor.Sensormodel.min_acceptable || item.sensor.last_values[0] >= item.sensor.Sensormodel.max_acceptable">
              <v-card-title primary class="title">{{ item.sensor.last_values ? item.sensor.last_values[item.sensor.last_values.length-1]:'none' }}</v-card-title>
              <v-card-text primary>{{ item.board.description }}</v-card-text>
            </v-card>
            <v-card class="vitaboxBoardSelector green darken-1" @click.native="goToBoardDetails(item.board, item.sensor)" v-else>
              <v-card-title primary class="title">{{ item.sensor.last_values ? item.sensor.last_values[item.sensor.last_values.length-1]:'none' }}}</v-card-title>
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
  props: {
    sensors: Array,
    type: String
  },
  methods: {
    getAverageValue() {
      let sum = 0,
        count = 0;
      this.sensors.forEach(sensor => {
        if (sensor.last_values && sensor.last_values.length > 0) {
          sum += sensor.last_values[0];
          count++;
        }
      });
      if (count === 0) return "none";
      else return sum / count;
    },
    goToBoardDetails(boardData, sensorData) {
      this.$store.commit("setBoardData", boardData);
      this.$store.commit("setSensorData", sensorData);
      this.$router.push("/board/detail");
    }
  }
};
</script>

<style>
.envIcon {
  width: 40px !important;
  height: 40px !important;
  padding-top: 45%;
}

.vitaboxBoardSelector {
-moz-box-shadow:    inset 0 0 10px #000000;
   -webkit-box-shadow: inset 0 0 10px #000000;
   box-shadow:         inset 0 0 5px #000000;
}

.vitaboxBoardSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}
</style>
