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
        <v-flex d-flex md6 lg4>
          <v-layout wrap>
            <v-flex d-flex sm6 md4 lg3 v-for="item in boardSensors" :key="item.id">
                <v-card light>
                  <a @click="showGraph(item)">
                    <v-card-title primary class="title">{{ item.sensor.last_values ? item.sensor.last_values[0]:'none' }}</v-card-title>
                    <v-card-text primary>{{ item.sensor.Sensormodel.measure }}</v-card-text>
                  </a>
                </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex md6 lg8>
              <v-card light>
                <v-card-title primary class="title">{{ selectedSensorGraph.board.Boardmodel.name }} : {{ selectedSensorGraph.sensor.Sensormodel.measure }}</v-card-title>
                <biometricGraph> </biometricGraph>
              </v-card>
            </v-flex>
            </v-layout>
    </v-container>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import BiometricGraph from "./BiometricGraph.vue";

export default {
  name: "patientDashboard",
  props: {
    selectedPatient: Object
  },
  data() {
    return {
      selectedSensorGraph: [],
      patientBoards: [],
      boardSensors: []
    };
  },
  components: {
    biometricGraph: BiometricGraph
  },
  created() {
    this.getPatientBoards();
  },

  methods: {
    getPatientBoards() {
      this.selectedPatient.Boards.forEach(board => {
        board.Sensors.forEach(sensor => {
          this.boardSensors.push({
            board: board,
            sensor: sensor
          });
        });
      });
      this.selectedSensorGraph = this.boardSensors[0];
    },
    showGraph(sensor) {
      this.selectedSensorGraph = sensor;
    }
  }
};
</script>

<style>
</style>
