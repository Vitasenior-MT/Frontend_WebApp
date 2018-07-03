<template>
  <v-container class="gridPatient" >
    <v-layout v-if="boardSensors.length > 0" wrap>
      <v-flex d-flex md4 lg2>
        <v-layout wrap>
          <v-container grid-list text-xs-center>
            <v-flex d-flex sm12 md12 lg12 >
              <v-card flat>
                <v-avatar size="150px" style="margin-top:10px"><img src="@/assets/logo.png"></v-avatar>
                <v-card flat>
                  <h3 class="headline mb-0">{{ this.selectedPatient.name }}</h3>
                </v-card>
                <v-card flat>
                  <v-tooltip bottom>
                    <v-btn slot="activator" @click.native='goToPatientProfile(this.selectedPatient)'>
                      <v-icon>fas fa-info-circle</v-icon>
                    </v-btn>
                    <span>Patient Details</span>
                  </v-tooltip>
                </v-card>
              </v-card>
            </v-flex>
          </v-container>
        </v-layout>
      </v-flex>
      <v-flex v-if="selectedSensorGraph != null" class="hidden-sm-and-down" md8 lg10>
        <v-container>
          <v-card light flat>
            <v-card-title primary class="title">
              {{ this.selectedSensorGraph.board.Boardmodel.name }} : {{ this.selectedSensorGraph.sensor.Sensormodel.measure }}
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <v-btn slot="activator" @click.native='goToBoardDetails(selectedSensorGraph.board, selectedSensorGraph.sensor, selectedPatient)'>
                  <v-icon>fas fa-info-circle</v-icon>
                </v-btn>
                <span>Sensor Details</span>
              </v-tooltip>
            </v-card-title>
            <div v-if="records" style="height:40vh; position:relative;">
              <canvas :id=" this.selectedSensorGraph.sensor.id"></canvas>
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
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout v-else wrap>
      <v-flex d-flex sm12 md12 lg12>
        <v-card light>
          <v-card-title primary class="title">This patient does not have biometric data associated</v-card-title>
          <v-card-text primary>Sorry</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-container fluid align-center justify-center>
      <v-layout wrap>
        <v-flex xs6 sm3 md3 lg3  v-for="item in boardSensors" :key="item.id">
            <v-card light flat hover style="height:100%">
              <a @click="showGraph(item)">
                <v-card-title primary class="title">
                  {{ item.sensor.last_values ? item.sensor.last_values[0] : 'none' }}
                </v-card-title>
                <v-card-text primary>{{ item.sensor.Sensormodel.measure }}</v-card-text>
              </a>
            </v-card>
        </v-flex>
      </v-layout>
    </v-container>  
  </v-container>
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
      page: 1
    };
  },
  created() {
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
        this.designGraph();
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
      this.selectedSensorGraph = sensor;
      this.records = [];
      this.getValues(0);
      this.designGraph();
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
          borderColor: '#47b784',
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
      this.$router.push("/board/detail");
    },
    goToPatientProfile(patientData){
      this.$store.commit("setPatientData", patientData);
      this.$router.push("/patient/detail");
    }
  }
};
</script>

<style>
</style>
