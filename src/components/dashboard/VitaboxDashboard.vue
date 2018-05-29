<template>
    <v-container fluid grid-list-xl id="vitaboxDashboard">
        <v-layout wrap >
            <v-flex d-flex xs12 sm12 md12 lg12>
                <v-card dark>
                    <v-carousel>
                        <patientDashboard v-for="item in patients" :key="item.id" :selectedPatient="selectedPatient(item)"></patientDashboard>
                    </v-carousel>
                </v-card>
            </v-flex>  
            <v-flex d-flex xs12 sm12 md12 lg12>
                <envBoardDashboard :sensors="tempSensors" :type="'Temperature'"></envBoardDashboard>
                <envBoardDashboard :sensors="humiSensors" :type="'Humidity'"></envBoardDashboard>
                <envBoardDashboard :sensors="monoSensors" :type="'Carbon Monoxide'"></envBoardDashboard>
                <envBoardDashboard :sensors="dioxiSensors" :type="'Carbon Dioxide'"></envBoardDashboard>    
                <!-- <v-card dark class="envGridSensors">
                    <v-card-title>Humidity</v-card-title>
                    <v-layout wrap >
                        <v-flex d-flex sm6 md4 lg3 v-for="item in humiSensors" :key="item.id">
                            <v-card light>
                                <v-card-title primary class="title">{{ item.last_values ? item.last_values[0]:'none' }}</v-card-title>
                                <v-card-text primary>{{ item.Sensormodel.measure }}</v-card-text>
                            </v-card>
                        </v-flex> 
                    </v-layout>
                </v-card>
                <v-card dark class="envGridSensors">
                    <v-card-title>Carbon Monoxide</v-card-title>
                    <v-layout wrap >
                        <v-flex d-flex sm6 md4 lg3 v-for="item in monoSensors" :key="item.id">
                            <v-card light>
                                <v-card-title primary class="title">{{ item.last_values ? item.last_values[0]:'none' }}</v-card-title>
                                <v-card-text primary>{{ item.Sensormodel.measure }}</v-card-text>
                            </v-card>
                        </v-flex> 
                    </v-layout>
                </v-card>
                 <v-card dark class="envGridSensors">
                    <v-card-title>Carbon Dioxide</v-card-title>
                    <v-layout wrap >
                        <v-flex d-flex sm6 md4 lg3 v-for="item in dioxiSensors" :key="item.id">
                            <v-card light>
                                <v-card-title primary class="title">{{ item.last_values ? item.last_values[0]:'none' }}</v-card-title>
                                <v-card-text primary>{{ item.Sensormodel.measure }}</v-card-text>
                            </v-card>
                        </v-flex> 
                    </v-layout>
                </v-card> -->
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
                    location: board.description,
                    sensor: sensor
                  });
                  break;
                case "humi":
                  this.humiSensors.push({
                    location: board.description,
                    sensor: sensor
                  });
                  break;
                case "mono":
                  this.monoSensors.push({
                    location: board.description,
                    sensor: sensor
                  });
                  break;
                case "dioxi":
                  this.dioxiSensors.push({
                    location: board.description,
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
