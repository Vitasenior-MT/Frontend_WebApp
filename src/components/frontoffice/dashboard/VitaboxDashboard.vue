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
          <envBoardDashboard :sensors="tempSensors" :type="'temperatura (ºC)'"></envBoardDashboard>
          <envBoardDashboard :sensors="humiSensors" :type="'humidade (%)'"></envBoardDashboard>
          <envBoardDashboard :sensors="monoSensors" :type="'monox. carbono (ppm)'"></envBoardDashboard>
          <envBoardDashboard :sensors="dioxiSensors" :type="'dioxi. carbono (ppm)'"></envBoardDashboard>    
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
    this.getPatients();
    this.getVitaboxBoards();
  },
  watch: {
    selectedVitabox(val) {
      this.getPatients();
      this.getVitaboxBoards();
    }
  },
  methods: {
    getPatients() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.selectedVitabox.id + "/patient")
        .then(response => {
          this.patients = response.data.patients;
          this.patientBoards = this.patients[0].Boards;
          console.log(this.patients[0].name);
          event_bus.$emit("waiting", false);
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
          event_bus.$emit("waiting", false);
        });
    },
    getVitaboxBoards() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.selectedVitabox.id + "/board")
        .then(response => {
          this.vitaboxBoards = response.data.boards;
          this.vitaboxBoardSensors = this.vitaboxBoards.filter(
            board => board.Boardmodel.type === "environmental"
          );
          this.tempSensors = this.vitaboxBoardSensors.map(board => {
            return {
              board: board,
              sensor: board.Sensors.filter(
                sensor => sensor.Sensormodel.tag === "temp"
              )[0]
            };
          });
          this.humiSensors = this.vitaboxBoardSensors.map(board => {
            return {
              board: board,
              sensor: board.Sensors.filter(
                sensor => sensor.Sensormodel.tag === "humi"
              )[0]
            };
          });
          this.monoSensors = this.vitaboxBoardSensors.map(board => {
            return {
              board: board,
              sensor: board.Sensors.filter(
                sensor => sensor.Sensormodel.tag === "mono"
              )[0]
            };
          });
          this.dioxiSensors = this.vitaboxBoardSensors.map(board => {
            return {
              board: board,
              sensor: board.Sensors.filter(
                sensor => sensor.Sensormodel.tag === "dioxi"
              )[0]
            };
          });
          event_bus.$emit("waiting", false);
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
          event_bus.$emit("waiting", false);
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
  padding: 5px 5px 5px 5px;
}
</style>
