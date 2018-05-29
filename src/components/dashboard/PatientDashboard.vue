<template>
    <v-container class="gridPatient">
        <v-list>
            <v-list-tile @click="goToPatientProfile(this.selectedPatient.id)">
                <v-list-tile-content>
                    <v-list-tile-title>{{ this.selectedPatient.name }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
        </v-list>
        <v-layout wrap>
        <v-flex d-flex md6 lg7 >
            <v-layout wrap>
            <v-flex d-flex sm6 md4 lg3 v-for="item in boardSensors" :key="item.id">
              <v-card light>
                <v-card-title primary class="title">{{ item.last_values ? item.last_values[0]:'none' }}</v-card-title>
                <v-card-text primary>{{ item.Sensormodel.measure }}</v-card-text>
              </v-card>
            </v-flex>
            </v-layout>
        </v-flex>
        <v-flex d-flex md6 lg5>
              <v-card light>
                <v-card-title primary class="title">GRAPH</v-card-title>
              </v-card>
            </v-flex>
            </v-layout>
    </v-container>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "patientDashboard",
  props: {
    selectedPatient: Object
  },
  data() {
    return {
      patientBoards: [],
      boardSensors: []
    };
  },
  created() {
    this.getPatientBoards();
  },
  methods: {
    getPatientBoards() {
      this.selectedPatient.Boards.forEach(board => {
        board.Sensors.forEach(sensor => {
          this.boardSensors.push(sensor);
        });
      });
    }
  }
};
</script>

<style>
</style>
