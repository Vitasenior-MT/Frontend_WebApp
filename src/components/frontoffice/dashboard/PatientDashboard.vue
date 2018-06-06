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
                <div v-if="records" style="height:350px; position:relative;">
                   <canvas :id=" selectedSensorGraph.sensor.id"></canvas>
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
                <!-- <biometricGraph> </biometricGraph> -->
              </v-card>
            </v-flex>
            </v-layout>
    </v-container>
</template>

<script>
import Chart from "chart.js";
import { event_bus } from "@/plugins/bus.js";
// import BiometricGraph from "./BiometricGraph.vue";

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
      page: 1
    };
  },
  // components: {
  //   biometricGraph: BiometricGraph
  // },
  created() {
    this.getPatientBoards();
  },
  mounted() {
    this.initGraph();
    this.getValues(0);
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
      this.initGraph();
      this.getValues(0);
    },
    getValues(page) {
      // event_bus.$emit("waiting", true);
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
          console.log(this.records);
          this.page += page;
          this.designGraph();
          // event_bus.$emit("waiting", false);
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("error", error.response.data);
          } else {
            event_bus.$emit("error", error.message);
          }
          // event_bus.$emit("waiting", false);
        });
    },
    initGraph() {
      this.chart = new Chart(document.getElementById(this.selectedSensorGraph.sensor.id), {
        type: "line",
        options: {
          legend: { display: false },
          scales: { xAxes: [{ display: false }] },
          responsive: true,
          maintainAspectRatio: false
        }
      });
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
          pointBackgroundColor: this.records.map(x => {
            return x.analyzed
              ? "rgba(152, 244, 70, 1)"
              : "rgba(255, 143, 40, 1)";
          }),
          backgroundColor: this.records.map(x => {
            return x.analyzed
              ? "rgba(152, 244, 70, 0.6)"
              : "rgba(255, 143, 40, 0.6)";
          }),
          borderWidth: 2
        },
        {
          label: "minimum acceptable",
          data: Array.from(
            { length },
            i => this.selectedSensorGraph.sensor.Sensormodel.min_acceptable
          ),
          borderWidth: 2,
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
          borderWidth: 2,
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
    }
  }
};
</script>

<style>
</style>
