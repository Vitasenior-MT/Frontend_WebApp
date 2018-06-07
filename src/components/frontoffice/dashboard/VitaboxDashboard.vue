<template>
  <v-layout wrap >
      <v-flex d-flex xs12 sm12 md12 lg12>
          <v-card dark v-if="patients.length > 0">
              <v-carousel :cycle="false" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" delimiter-icon="fas fa-circle">
                <v-carousel-item v-for="item in patients" :key="item.id" >
                  <patientDashboard :selectedPatient="item"></patientDashboard>
                </v-carousel-item>
              </v-carousel>
          </v-card>
      </v-flex>  
      <v-flex v-if="vitaboxBoardSensors.length > 0" d-flex xs12 sm12 md12 lg12 style="padding-top:10px">
          <envBoardDashboard v-if="tempSensors.length != 0" :sensors="tempSensors" :type="tempSensors[0].sensor.Sensormodel.measure"></envBoardDashboard>
          <envBoardDashboard v-if="humiSensors.length != 0" :sensors="humiSensors" :type="humiSensors[0].sensor.Sensormodel.measure"></envBoardDashboard>
          <envBoardDashboard v-if="monoSensors.length != 0" :sensors="monoSensors" :type="monoSensors[0].sensor.Sensormodel.measure"></envBoardDashboard>
          <envBoardDashboard v-if="dioxiSensors.length != 0" :sensors="dioxiSensors" :type="dioxiSensors[0].sensor.Sensormodel.measure"></envBoardDashboard>    
      </v-flex>
      <v-flex v-else d-flex xs12 sm12 md12 lg12 style="padding-top:10px">
        <v-card light>
          <v-card-title primary class="title">This vitabox does not have environmental data associated</v-card-title>
          <v-card-text primary>Sorry</v-card-text>
        </v-card> 
      </v-flex>  
  </v-layout>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import PatientDashboard from "./PatientDashboard.vue";
import EnvBoardDashboard from "./EnvBoardDashboard.vue";

export default {
  name: "vitaboxDashboard",
  props: {
    selectedVitabox: Object
  },
  data() {
    return {
      patients: [],
      patientBoards: [],
      vitaboxBoards: [],
      vitaboxBoardSensors: [],
      tempSensors: [],
      humiSensors: [],
      monoSensors: [],
      dioxiSensors: []
    };
  },
  components: {
    patientDashboard: PatientDashboard,
    envBoardDashboard: EnvBoardDashboard
  },
  created() {
    // this.$watch(
    //   "selectedVitabox",
    //   selectedVitabox => {
        this.getPatients();
        this.getVitaboxBoards();
    //   },
    //   { immediate: true }
    // );
  },

  methods: {
    getPatients() {
      event_bus.$data.http
        .get("/vitabox/" + this.selectedVitabox.id + "/patient")
        .then(response => {
          this.patients = response.data.patients;
          this.patientBoards = this.patients[0].Boards;
          console.log(this.patients[0].name);
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
        });
    },
    getVitaboxBoards() {
      event_bus.$data.http
        .get("/vitabox/" + this.selectedVitabox.id + "/board")
        .then(response => {
          this.vitaboxBoards = response.data.boards;
          this.vitaboxBoards.forEach(board => {
            if (board.Boardmodel.type === "environmental") {
              this.vitaboxBoardSensors.push(board);
            }
          });
          this.vitaboxBoardSensors.forEach(board => {
            board.Sensors.forEach(sensor => {
              switch (sensor.Sensormodel.tag) {
                case "temp":
                  this.tempSensors.push({
                    board: board,
                    sensor: sensor
                  });
                  break;
                case "humi":
                  this.humiSensors.push({
                    board: board,
                    sensor: sensor
                  });
                  break;
                case "mono":
                  this.monoSensors.push({
                    board: board,
                    sensor: sensor
                  });
                  break;
                case "dioxi":
                  this.dioxiSensors.push({
                    board: board,
                    sensor: sensor
                  });
                  break;
                default:
                  break;
              }
            });
          });
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
        });
    },
    selectedPatient(patientData) {
      this.$store.commit("setPatientData", patientData);
      this.patientBoards = patientData.Boards;
      return patientData;
    }
  }
};
</script>

<style>
.carousel {
  height: inherit !important;
}

.gridPatient {
  padding: 0 45px 60px 45px;
}

.envGridSensors {
  padding: 0 5px 5px 5px;
}


</style>
