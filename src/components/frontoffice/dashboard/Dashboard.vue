<template>
  <v-content v-if="vitabox">
    <v-card @click.native="goToVitaboxDetails($store.state.vitabox)" class="mr-1" dark>
      <v-list class="dark-hover">
        <v-list-tile style="height:54px;">
          <v-list-tile-avatar>
            <v-icon>fas fa-compass</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title
              class="headline primary_l--text"
              style="height:auto;"
            >{{ this.$store.state.vitabox.address }}</v-list-tile-title>
            <v-list-tile-sub-title class="white--text">{{ this.$store.state.vitabox.id }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action class="no-min-width">
            <v-tooltip bottom>
              <v-icon slot="activator" color="blue lighten-1">fa fa-chevron-right</v-icon>
              <span>{{ $t('dashboard.vitabox_details') }}</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card>

    <v-divider class="my-1 mr-1"></v-divider>

    <v-layout row wrap>
      <v-flex lg2>
        <v-layout wrap fill-height>
          <v-flex xs6 sm3 lg12 v-if="tempSensors.every(checkNulls) > 0">
            <envBoardDashboard :sensors="tempSensors" :type="'temp'"></envBoardDashboard>
          </v-flex>
          <v-flex xs6 sm3 lg12 v-if="humiSensors.every(checkNulls) > 0">
            <envBoardDashboard :sensors="humiSensors" :type="'humi'"></envBoardDashboard>
          </v-flex>
          <v-flex xs6 sm3 lg12 v-if="monoSensors.every(checkNulls) > 0">
            <envBoardDashboard :sensors="monoSensors" :type="'mono'"></envBoardDashboard>
          </v-flex>
          <v-flex xs6 sm3 lg12 v-if="dioxiSensors.every(checkNulls) > 0">
            <envBoardDashboard :sensors="dioxiSensors" :type="'diox'"></envBoardDashboard>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex lg10>
        <patientDashboard v-if="patients && patients.length>0" :patients="patients"></patientDashboard>
      </v-flex>
    </v-layout>
    <br>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import PatientDashboard from "./PatientDashboard.vue";
import EnvBoardDashboard from "./EnvBoardDashboard.vue";

export default {
  data: () => {
    return {
      patients: [],
      tempSensors: [],
      humiSensors: [],
      monoSensors: [],
      dioxiSensors: [],
      drawer: true,
      mini: true
    };
  },
  computed: {
    vitabox() {
      return this.$store.state.vitabox;
    }
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
    },
    goToVitaboxDetails(vitaboxData) {
      this.$router.push("/frontoffice/vitabox/detail");
    }
  },
  components: {
    patientDashboard: PatientDashboard,
    envBoardDashboard: EnvBoardDashboard
  }
};
</script>

<style>
.no-min-width {
  min-width: 0;
}
</style>
