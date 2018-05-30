<template>
  <v-card  dark class="envGridSensors" >
    <v-flex d-flex sm12 md12 lg12>
      <v-card flat light hover @click="goToTypeDetails(sensors)">
        <v-card-title>{{ type }}</v-card-title>
        <v-card-text primary>{{ getAverageValue() }}</v-card-text>
      </v-card>
    </v-flex>
    <v-layout wrap >
        <v-flex d-flex sm6 md4 lg3 v-for="item in sensors" :key="item.id">
            <v-card flat hover light @click="goToSensorDetails(item)">
                <v-card-title primary class="title">{{ item.last_values ? item.last_values[0]:'none' }}</v-card-title>
                <v-card-text primary>{{ item.board.description }}</v-card-text>
            </v-card>
        </v-flex> 
    </v-layout>
  </v-card>
</template>


<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "envBoardDashboard",
  props: {
    sensors: Array,
    type: String
  },
  data() {
    return {
    };
  },
  methods: {
    getAverageValue() {
      var averageValue = 0;
      var count = 0;
      this.sensors.forEach(sensor => {
        if(sensor.last_values == null){
          averageValue = 'none';
        }else{
          average += sensor.last_values[0];
          count++;
        }
        if(averageValue != 'none'){
          average = average / count;
        }
      });
      return averageValue;
    },
    goToTypeDetails(){

    }
  }
};
</script>

<style>
</style>
