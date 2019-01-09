<template>
  <v-container class="pa-0" style="max-width:100%;">
    <v-carousel v-if="patients.length > 0" class="patientCarousel mt-2" lazy :cycle="false" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" hide-delimiters>
      <v-carousel-item v-for="item in patients" :key="item.id">
        <patientDashboard :selectedPatient="item"></patientDashboard>
      </v-carousel-item>
    </v-carousel>
    <v-card class="py-2 mt-2" dark flat>
      <v-layout wrap>
        <v-flex xs3 v-if="tempSensors.every(checkNulls) > 0">
          <envBoardDashboard :sensors="tempSensors" :type="'temp'"></envBoardDashboard>
        </v-flex>
        <v-flex xs3 v-if="humiSensors.every(checkNulls) > 0">
          <envBoardDashboard :sensors="humiSensors" :type="'humi'"></envBoardDashboard>
        </v-flex>
        <v-flex xs3 v-if="monoSensors.every(checkNulls) > 0">
          <envBoardDashboard :sensors="monoSensors" :type="'mono'"></envBoardDashboard>
        </v-flex>
        <v-flex xs3 v-if="dioxiSensors.every(checkNulls) > 0">
          <envBoardDashboard :sensors="dioxiSensors" :type="'diox'"></envBoardDashboard>
        </v-flex>
      </v-layout>
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
  created() {
    this.getPatients(this.$store.state.vitabox.id);
    this.getBoards(this.$store.state.vitabox.id);
  },
  watch: {
    vitabox(x) {
      if (x) {
        this.getPatients(x.id);
        this.getBoards(x.id);
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
          this.$store.commit("setPatientsList", response.data.patients);
          this.patients = response.data.patients;
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
    getBoards(vitabox_id) {
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
                sensor => sensor.Sensormodel.tag === "diox"
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
    }
  }
};
</script>

<style lang="stylus">
.patientCarousel {
  height: 100% !important;
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
