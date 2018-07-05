<template>
  <v-list two-line dense>
    <v-list-tile avatar ripple v-for="sensor in sensors" :key="sensor.id">
      <v-list-tile-content>
        <v-list-tile-title>{{sensor.Sensormodel.transducer}} - {{sensor.Sensormodel.measure}}</v-list-tile-title>
        <v-list-tile-sub-title>{{sensor.id}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action v-if="sensor.last_commit">
        <v-list-tile-action-text>{{getTime(sensor.last_commit)}}</v-list-tile-action-text>
        <v-icon v-if="selected.indexOf(index) < 0" color="grey lighten-1" >fas fa-exclamation-triangle</v-icon>
      </v-list-tile-action>
      <v-list-tile-action v-else>
        <v-list-tile-action-text>NaN</v-list-tile-action-text>
        <v-icon color="grey lighten-1" >fas fa-exclamation-triangle</v-icon>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
  <!-- <v-card flat class="ash_l">
    <v-card-title class="pb-1">
      <p class="title">{{sensor.Sensormodel.transducer}} - {{sensor.Sensormodel.measure}}</p>
    </v-card-title>
    <v-card-text class="py-0">
      <table style="width:100%">
        <tr>
          <td class="text-xs-right"><label class="primary_d--text mr-2">last commit</label></td>
          <th class="text-xs-left">
            <label v-if="sensor.last_commit">{{getTime(sensor.last_commit)}}</label>
            <label v-else>NaN</label>
          </th>
        </tr>
        <tr>
          <td class="text-xs-right"><label class="primary_d--text mr-2">id</label></td>
          <th class="text-xs-left" colspan="2">{{sensor.id}}</th>
        </tr>
      </table>
    </v-card-text>
  </v-card> -->
</template>

<script>
import Chart from "chart.js";
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "sensor_graph",
  props: {
    sensors: Array,
    patient: String
  },
  data: () => {
    return {
      warning: false
    };
  },
  methods: {
    getTime(date) {
      let miliseconds = new Date() - new Date(date);
      if (miliseconds < 1000) return "<1 sec";
      else if (miliseconds < 60000) {
        return "~" + Math.floor(miliseconds / 1000) + " sec";
      } else if (miliseconds < 3600000) {
        return "~" + Math.floor(miliseconds / 60000) + " min";
      } else {
        this.warning = true;
        if (miliseconds < 86400000) {
          return Math.floor(miliseconds / 3600000) + " hours";
        } else return ">24 hours";
      }
    }
  }
};
</script>