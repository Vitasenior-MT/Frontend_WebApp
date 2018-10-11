<template>
    <v-card color="transparent" class="pb-1" flat>
      <v-layout class="pb-0" wrap>
          <v-card dark height="100%" width="100%" class="vitaboxDetailsSelector" @click.native='goToPatientProfile(selectedPatient)'>
            <v-layout wrap fill-height >
              <v-flex md2 class="text-xs-center pt-3 pb-3">
                <v-avatar tile size="70"><img src="@/assets/logo.png"></v-avatar>
              </v-flex>
              <v-flex md9 class="pt-3 pb-3">
                <p class="display-1 primary_l--text mb-2">{{ this.selectedPatient.name}}</p>
                <p class="asg--text mb-1">{{ this.selectedPatient.id}}</p>
              </v-flex>
                <v-flex xs1>
                  <v-tooltip bottom >
                    <v-icon slot="activator" class="primary_d--text pt-2">fa fa-info-circle</v-icon>
                    <span>Patient Details</span>
                  </v-tooltip>
                </v-flex>
            </v-layout>
          </v-card>
      </v-layout>

      <v-layout wrap v-if="selectedSensorGraph != null" class="graphContainer" dark>
        <v-flex xs12 class="pb-2 pt-1">
          <v-card>
            <v-layout row>
              <v-avatar tile class="pl-3"><img :src="require('@/assets/'+this.selectedSensorGraph.board.Boardmodel.tag+'_icon.svg')"></v-avatar>
              <span class="title pa-3 primary--text"> {{ this.selectedSensorGraph.board.Boardmodel.name }} : {{ this.selectedSensorGraph.sensor.Sensormodel.measure }}</span>
              <v-spacer></v-spacer>
                <v-icon small>fas fa-calendar-alt</v-icon>
                <span class="pa-3"> Última actualização:  {{ this.lastrecord }} </span>
              <v-spacer></v-spacer>
              <v-tooltip bottom >
                <v-btn slot="activator" color="primary_d" @click.native='goToBoardDetails(selectedSensorGraph.board, selectedSensorGraph.sensor, selectedPatient)'>
                  <v-icon>fas fa-info-circle</v-icon>
                </v-btn>
                <span>Sensor Details</span>
              </v-tooltip>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex class="hidden-sm-and-down pr-1 pb-1 pt-0" md9>
          <v-card class="bioGraphCard" light flat>
            <div v-if="records" id="bioGraph">
              <canvas :id="this.selectedSensorGraph.sensor.id"></canvas>
            </div>
            <v-layout row wrap>
              <v-flex class="py-0">
                <v-btn v-if="records.length>24" block color="primary" flat @click.native="getValues(1)"><v-icon>fas fa-angle-double-left</v-icon></v-btn>
                <v-btn v-else block flat disabled><v-icon>fas fa-angle-double-left</v-icon></v-btn>
              </v-flex>
              <v-flex class="py-0">
                <v-btn v-if="page>1" color="primary" block flat @click.native="getValues(-1)"><v-icon>fas fa-angle-double-right</v-icon></v-btn>
                <v-btn v-else block flat disabled><v-icon>fas fa-angle-double-right</v-icon></v-btn>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex md3 class="hidden-sm-and-down">
          <v-layout wrap>
            <v-flex xs6 sm4 md12 class="pa-0" v-for="item in boardSensors.slice(0, 5)" :key="item.id">
              <v-list light class="py-0 vitaboxDetailsSelector" style="height:60px;">
                <v-list-tile class="px-0 py-2" :color="verifyValue(item.sensor)" @click.native="showGraph(item)">
                  <v-list-tile-avatar size="30" tile class="bioGraphAvatarCard">
                    <img class="bioLogo" :src="require('@/assets/'+item.board.Boardmodel.tag+'_icon.svg')">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="font-weight-bold">{{ item.sensor.last_values ? item.sensor.last_values[item.sensor.last_values.length-1]+item.sensor.Sensormodel.unit : 'none' }}</v-list-tile-title>
                    <v-list-tile-sub-title class="primary--text">{{ item.sensor.Sensormodel.measure }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs6 sm4 md3 class="pb-1 pl-0 pr-0 hidden-sm-and-down" v-for="item in boardSensors.slice(5)" :key="item.id">
          <v-list light class="py-0 vitaboxDetailsSelector" style="height:60px;">
            <v-list-tile class="px-0 py-2" :color="verifyValue(item.sensor)" @click.native="showGraph(item)">
              <v-list-tile-avatar size="30" tile class="bioGraphAvatarCard">
                <img class="bioLogo" :src="require('@/assets/'+item.board.Boardmodel.tag+'_icon.svg')">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-bold">{{ item.sensor.last_values ? item.sensor.last_values[item.sensor.last_values.length-1]+item.sensor.Sensormodel.unit : 'none' }}</v-list-tile-title>
                <v-list-tile-sub-title class="primary--text">{{ item.sensor.Sensormodel.measure }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs6 sm4 md3 class="pb-2 pl-0 pr-0 hidden-md-and-up" v-for="item in boardSensors" :key="item.id">
          <v-list light class="py-0 vitaboxDetailsSelector" style="height:60px;">
            <v-list-tile class="px-0 py-2" :color="verifyValue(item.sensor)" @click.native="showGraph(item)">
              <v-list-tile-avatar size="30" tile class="bioGraphAvatarCard">
                <img class="bioLogo" :src="require('@/assets/'+item.board.Boardmodel.tag+'_icon.svg')">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="font-weight-bold">{{ item.sensor.last_values ? item.sensor.last_values[item.sensor.last_values.length-1]+item.sensor.Sensormodel.unit : 'none' }}</v-list-tile-title>
                <v-list-tile-sub-title class="primary--text">{{ item.sensor.Sensormodel.measure }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
      <v-layout v-else class="mx-5">
        <v-card light height="100%" class="text-md-center">
          <v-card-title primary class="pt-5 title">This patient does not have biometric data associated</v-card-title>
          <v-card-text primary>Sorry</v-card-text>
        </v-card>
      </v-layout>
    </v-card>
</template>

<script>
import Chart from "chart.js";
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "patientDashboard",
  props: {
    selectedPatient: Object
  },
  data: () => {
    return {
      selectedSensorGraph: [],
      patientBoards: [],
      boardSensors: [],
      chart: null,
      records: [],
      lastrecord: null,
      page: 1
    };
  },
  created() {
    this.$store.commit("setPatientData", this.selectedPatient);
    this.getPatientBoards();
  },
  mounted() {
    if (this.selectedSensorGraph != null) {
      this.initGraph();
      this.getValues(0);
    }
  },
  watch: {
    selectedPatient(val) {
      this.getPatientBoards();
      if (this.selectedSensorGraph != null) {
        this.getValues(0);
      }
    }
  },
  methods: {
    getPatientBoards() {
      this.boardSensors = [];
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
      let element = document.getElementById("bioGraph");
      element.classList.remove("fadeIn");
      void element.offsetWidth;
      element.classList.add("fadeIn");
      this.selectedSensorGraph = sensor;
      this.records = [];
      this.getValues(0);
    },
    getValues(page) {
      event_bus.$data.http
        .get(
          "/record/sensor/" +
            this.selectedSensorGraph.sensor.id +
            "/patient/" +
            this.selectedPatient.id +
            "/page/" +
            (this.page + page)
        )
        .then(response => {
          this.records = response.data.records.sort(this.compare);
          this.page += page;
          this.designGraph();
          this.lastrecord = this.records[this.records.length - 1].datetime;
          this.lastrecord = new Date(this.lastrecord).toLocaleDateString(
            "pt-pt",
            this.options
          );
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("error", error.response.data);
          } else {
            event_bus.$emit("error", error.message);
          }
        });
    },
    initGraph() {
      this.chart = new Chart(
        document.getElementById(this.selectedSensorGraph.sensor.id),
        {
          type: "line",
          options: {
            legend: { display: true },
            scales: { xAxes: [{ display: false }] },
            responsive: true,
            maintainAspectRatio: false
          }
        }
      );
    },
    designGraph() {
      let length = this.records.length;
      this.chart.data.labels = this.records.map(x => {
        return this.formatDate(x.datetime);
      });
      this.chart.data.datasets = [
        {
          label: this.selectedSensorGraph.sensor.Sensormodel.measure,
          data: this.records.map(x => {
            return x.value;
          }),
          backgroundColor: "rgba(71, 183,132,.5)",
          borderColor: "#47b784",
          borderWidth: 3
        },
        {
          label: "minimum acceptable",
          data: Array.from(
            { length },
            i => this.selectedSensorGraph.sensor.Sensormodel.min_acceptable
          ),
          borderWidth: 3,
          fill: false,
          borderColor: "rgba(58, 100, 252, 1)",
          pointRadius: 0
        },
        {
          label: "maximum acceptable",
          data: Array.from(
            { length },
            i => this.selectedSensorGraph.sensor.Sensormodel.max_acceptable
          ),
          borderWidth: 3,
          fill: false,
          borderColor: "rgba(255, 83, 35, 1)",
          pointRadius: 0
        }
      ];
      this.chart.update();
    },
    formatDate(date) {
      let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      let d = new Date(date);
      return (
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds() +
        " - " +
        d.getDate() +
        " " +
        monthNames[d.getMonth()] +
        " " +
        d.getFullYear()
      );
    },
    getTime(date) {
      let miliseconds = new Date() - new Date(date);
      if (miliseconds < 1000) return "<1 sec";
      else if (miliseconds < 60000) {
        return "~" + Math.floor(miliseconds / 1000) + " sec";
      } else if (miliseconds < 3600000) {
        return "~" + Math.floor(miliseconds / 60000) + " min";
      } else if (miliseconds < 86400000) {
        return Math.floor(miliseconds / 3600000) + " hours";
      } else return ">24 hours";
    },
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
    },
    goToBoardDetails(boardData, sensorData, patientData) {
      this.$store.commit("setBoardData", boardData);
      this.$store.commit("setSensorData", sensorData);
      this.$store.commit("setPatientData", patientData);
      this.$router.push("/frontoffice/board/detail");
    },
    goToPatientProfile(patientData) {
      this.$store.commit("setPatientData", patientData);
      this.$router.push("/frontoffice/patient/detail");
    },
    verifyValue(sensor) {
      let profile = this.selectedPatient.Profiles.filter(
        x => x.tag === sensor.Sensormodel.tag
      )[0];
      if (
        sensor.last_values &&
        profile.max > sensor.last_values[sensor.last_values.length - 1] &&
        profile.min < sensor.last_values[sensor.last_values.length - 1]
      )
        return "success";
      else return "error";
    }
  }
};
</script>

<style>
.patientDetailsSelector {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.graphContainer {
  padding: 0 35px;
}

.bioAvatar {
  padding-top: 10%;
  padding-left: 10px;
}

.bioLogo {
  height: 40px;
  width: 40px;
}

.bioGraphCard {
  padding: 0px;
  height: 100%;
}

#bioGraph {
  height: 250px;
  position: relative;
}

.bioGraphAvatarCard {
  min-width: 40px;
}
</style>
