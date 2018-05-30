<template>
    <v-container fluid grid-list-sm id="vitaboxDashboard">
        <v-layout wrap >
            <v-flex d-flex xs12 sm12 md12 lg12>
                <v-card dark v-if="patients.length > 0">
                    <v-carousel :cycle="false">
                      <v-carousel-item v-for="item in patients" :key="item.id" >
                        <patientDashboard :selectedPatient="item"></patientDashboard>
                      </v-carousel-item>
                    </v-carousel>
                </v-card>
            </v-flex>  
            <v-flex d-flex xs12 sm12 md12 lg12 style="padding-top:10px">
                <envBoardDashboard v-if="tempSensors.length != 0" :sensors="tempSensors" :type="tempSensors[0].sensor.Sensormodel.measure"></envBoardDashboard>
                <envBoardDashboard v-if="humiSensors.length != 0" :sensors="humiSensors" :type="humiSensors[0].sensor.Sensormodel.measure"></envBoardDashboard>
                <envBoardDashboard v-if="monoSensors.length != 0" :sensors="monoSensors" :type="monoSensors[0].sensor.Sensormodel.measure"></envBoardDashboard>
                <envBoardDashboard v-if="dioxiSensors.length != 0" :sensors="dioxiSensors" :type="dioxiSensors[0].sensor.Sensormodel.measure"></envBoardDashboard>    
            </v-flex>  
        </v-layout>
    </v-container> 
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import PatientDashboard from "@/components/dashboard/PatientDashboard.vue";
import EnvBoardDashboard from "@/components/dashboard/EnvBoardDashboard.vue";

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
  methods: {
    getPatients() {
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/patient")
        .then(response => {
          this.patients = response.data.patients;
          this.$store.state.patient = this.patients[0];
          this.patientBoards = this.patients[0].Boards;
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
        .get("/vitabox/" + this.$store.state.vitabox.id + "/board")
        .then(response => {
          this.vitaboxBoards = response.data.boards;
          this.$store.state.vitabox = this.vitaboxBoards[0];
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
    },
    selectedVitaboxBoard(vitaboxBoardData) {
      //this.$store.commit("setVitaboxBoardData", vitaboxBoardData);
      return vitaboxBoardData;
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
