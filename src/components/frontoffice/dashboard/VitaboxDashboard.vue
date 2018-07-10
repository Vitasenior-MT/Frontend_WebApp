<template>
  <v-container style="padding:0px; max-width:100%">
    <v-layout wrap row>
      <v-flex xs12>
        <v-card dark flat v-if="patients.length > 0">
          <v-carousel class="patientCarousel" lazy :cycle="false" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" hide-delimiters>
            <v-carousel-item v-for="item in patients" :key="item.id" transition="fade" reverse-transition="fade">
              <patientDashboard :selectedPatient="selectedPatient(item)"></patientDashboard>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card dark flat style="padding-bottom:40px; " >
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import PatientDashboard from "./PatientDashboard.vue";
import EnvBoardDashboard from "./EnvBoardDashboard.vue";

export default {
  name: "vitaboxDashboard",
  props: {
    vitabox: Object
  },
  data() {
    return {
      patients: [],
      hasboards: false,
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
  watch: {
    vitabox(x) {
      if (x) {
        this.getPatients(x.id);
        this.getVitaboxBoards(x.id);
      }
    }
  },
  methods: {
    getPatients(vitabox_id) {
      event_bus.$emit("waiting", true);
      this.patients = [];
      event_bus.$data.http
        .get("/vitabox/" + vitabox_id + "/patient")
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
    getVitaboxBoards(vitabox_id) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + vitabox_id + "/board")
        .then(response => {
          let boardSensors = response.data.boards.filter(
            board => board.Boardmodel.type === "environmental"
          );
          this.hasboards = boardSensors.length > 0;
          this.tempSensors = boardSensors.map(board => {
            return {
              board: board,
              sensor: board.Sensors.filter(
                sensor => sensor.Sensormodel.tag === "temp"
              )[0]
            };
          });
          this.humiSensors = boardSensors.map(board => {
            return {
              board: board,
              sensor: board.Sensors.filter(
                sensor => sensor.Sensormodel.tag === "humi"
              )[0]
            };
          });
          this.monoSensors = boardSensors.map(board => {
            return {
              board: board,
              sensor: board.Sensors.filter(
                sensor => sensor.Sensormodel.tag === "mono"
              )[0]
            };
          });
          this.dioxiSensors = boardSensors.map(board => {
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
      return sensors.sensor != null;
    },
    selectedPatient(patientData) {
      this.patientBoards = patientData.Boards;
      return patientData;
    }
  }
};
</script>

<style lang="stylus">
.patientCarousel {
  height: 100%;
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
