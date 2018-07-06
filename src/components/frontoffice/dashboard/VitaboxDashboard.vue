<template>
  <v-container style="padding:0px; max-width:100%">
    <v-card dark flat v-if="patients.length > 0">
      <v-carousel :cycle="false" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" hide-delimiters>
        <v-carousel-item v-for="item in patients" :key="item.id" transition="fade" reverse-transition="fade">
          <patientDashboard :selectedPatient="selectedPatient(item)"></patientDashboard>
        </v-carousel-item>
      </v-carousel>
    </v-card>
    <v-card dark v-else flat style="padding:0px">
      <v-card-title primary class="title">This vitabox does not have patient data associated</v-card-title>
      <v-card-text primary>Sorry</v-card-text>
    </v-card>
    <v-card dark flat v-if="vitaboxBoardSensors.length > 0" style="padding-bottom:40px; " >
      <v-layout wrap>
        <v-flex v-if="tempSensors.every(checkNulls) > 0">
          <envBoardDashboard :sensors="tempSensors" :type="'temperatura (ºC)'"></envBoardDashboard>
        </v-flex>
        <v-flex v-if="humiSensors.every(checkNulls) > 0">
          <envBoardDashboard :sensors="humiSensors" :type="'humidade (%)'"></envBoardDashboard>
        </v-flex>
        <v-flex v-if="monoSensors.every(checkNulls) > 0">
          <envBoardDashboard :sensors="monoSensors" :type="'monox. carbono (ppm)'"></envBoardDashboard>
        </v-flex>
        <v-flex v-if="dioxiSensors.every(checkNulls) > 0">
          <envBoardDashboard :sensors="dioxiSensors" :type="'dioxi. carbono (ppm)'"></envBoardDashboard>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card v-else flat style="padding-top:10px">
      <v-card-title primary class="title">This vitabox does not have environmental data associated</v-card-title>
      <v-card-text primary>Sorry</v-card-text>
    </v-card> 
  </v-container>
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
      this.patients = [];
      event_bus.$data.http
        .get("/vitabox/" + this.selectedVitabox.id + "/patient")
        .then(response => {
          this.patients = response.data.patients;
          if (this.patients.length > 0) {
            this.patientBoards = this.patients[0].Boards;
          }
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
    checkNulls(sensors) {
      return sensors != null;
    },
    selectedPatient(patientData) {
      this.$store.commit("setPatientData", patientData);
      this.patientBoards = patientData.Boards;
      return patientData;
    }
  }
};
</script>

<style lang="stylus">
.carousel {
  height: inherit !important;
}

.gridPatient {
  padding-left: 45px;
  padding-top: 0px;
  padding-bottom: 40px;
}

.envGridSensors {
  padding: 5px;
}

#carousel-view .fade {
  &-enter-active, &-leave-active, &-leave-to {
    transition: 0.3s ease-out;
    position: absolute;
    top: 0;
    left: 0;
  }

  &-enter, &-leave, &-leave-to {
    opacity: 0;
  }
}
</style>
