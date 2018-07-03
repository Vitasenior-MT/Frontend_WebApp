<template>
    <v-container grid-list text-xs-center v-if="sensors.length > 0 || sensors.sensor != null" class="envGridSensors px-0">
      <v-flex style="padding:5px" v-if="getAverageValue() <= sensors[0].sensor.Sensormodel.min_acceptable || getAverageValue() >= sensors[0].sensor.Sensormodel.max_acceptable">
        <v-layout row >
          <v-flex xs3 sm2 >  
            <v-card class="red darken-4" style="height:100%">
              <v-container fill-height>
                <v-avatar justify-center align-center ><img src="@/assets/logo.png"></v-avatar>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex xs9 sm10>  
            <v-card class="red darken-1">
              <v-card-text headline class="text-md-center">{{ getAverageValue() }}</v-card-text>
              <v-card-text primary>{{ type }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex style="padding:5px" v-else>
        <v-layout row>
          <v-flex xs3 sm2>
            <v-card class="green darken-4" style="height:100%">
               <v-avatar ><img src="@/assets/logo.png"></v-avatar>
            </v-card>
          </v-flex>
          <v-flex xs9 sm10>  
            <v-card hover @click="goToTypeDetails(sensors)" class="green darken-1">
              <v-card-title>{{ type }}</v-card-title>
              <v-card-text primary>{{ getAverageValue() }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-layout row wrap>
          <v-flex sm4 md6 lg4 v-for="item in sensors" :key="item.id" style="padding:5px" >
            <v-card hover @click.native="goToBoardDetails(item.board, item.sensor)" v-if="getAverageValue() <= item.sensor.Sensormodel.min_acceptable || getAverageValue() >= item.sensor.Sensormodel.max_acceptable" class="red darken-1">
              <v-card-title primary class="title">{{ item.last_values ? item.last_values[0]:'none' }}</v-card-title>
              <v-card-text primary>{{ item.board.description }}</v-card-text>
            </v-card>
            <v-card hover @click.native="goToBoardDetails(item.board, item.sensor)" v-else class="green darken-1">
              <v-card-title primary class="title">{{ item.last_values ? item.last_values[0]:'none' }}</v-card-title>
              <v-card-text primary>{{ item.board.description }}</v-card-text>
            </v-card>
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
    type: String,
  },
  data() {
    return {
      averageValue: 0
    };
  },
  methods: {
    getAverageValue() {
      this.averageValue = 0;
      var count = 0;
      this.sensors.forEach(sensor => {
        if (sensor.last_values == null) {
          this.averageValue = "none";
        } else {
          average += sensor.last_values[0];
          count++;
        }
        if (this.averageValue != "none") {
          average = average / count;
        }
      });
      return this.averageValue;
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
</style>
