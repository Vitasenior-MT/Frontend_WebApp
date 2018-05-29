<template>
  <v-card dark class="envGridSensors">
    <v-card-title>{{ type }} : {{ averageValue }}</v-card-title>
    <v-layout wrap >
        <v-flex d-flex sm6 md4 lg3 v-for="item in sensors" :key="item.id">
            <v-card light >
                <v-card-title primary class="title">{{ item.sensor.last_values ? item.sensor.last_values[0]:'none' }}</v-card-title>
                <v-card-text primary>{{ item.location }}</v-card-text>
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
      averageValue: null
    };
  },
  created() {
    this.sensors.forEach(sensor => {
      
    });

  },
  methods: {
    
  }
};
</script>

<style>
</style>
