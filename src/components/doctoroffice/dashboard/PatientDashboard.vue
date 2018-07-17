<template>
  <div v-if="selectedSensorGraph != null">
    <v-card class="bioGraphCard" light flat>
      <v-layout row>
        <v-avatar class="pa-4" size="35px"><img :src="require('@/assets/' + this.selectedSensorGraph.board.Boardmodel.tag + '_icon.png')"></v-avatar>
        <span class="title pa-3 primary--text"> {{ this.selectedSensorGraph.board.Boardmodel.name }} : {{ this.selectedSensorGraph.sensor.Sensormodel.measure }}</span>
        <v-spacer></v-spacer>
            <v-icon small>fas fa-calendar-alt</v-icon>
            <span class="pa-3"> Última actualização:  {{ this.lastrecord }} </span>
        <v-spacer></v-spacer>
        <v-tooltip bottom >
          <v-btn slot="activator" color="primary_d" @click.native='goToBoardDetails(selectedSensorGraph.board, selectedSensorGraph.sensor, $store.state.patient)'>
            <v-icon>fas fa-info-circle</v-icon>
          </v-btn>
          <span>Sensor Details</span>
        </v-tooltip>
      </v-layout>
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
    <v-layout wrap justify-center class="pt-1 ml-1 mb-1">
      <v-flex xs12 sm12 md4 lg2 v-for="item in boardSensors" :key="item.id">
        <v-card class="patientBoardSelector" light flat style="height:100%; padding-bottom:10px;" @click.native="showGraph(item)">
          <v-avatar class="bioAvatar" style="padding-left:10px;"><img class="bioLogo" :src="require('@/assets/'+item.board.Boardmodel.tag+'_icon.png')"></v-avatar>
          <span class="title" style="color:#3faf7d; padding-left:10px;">{{ item.sensor.last_values ? item.sensor.last_values[item.sensor.last_values.length-1] : 'none' }}</span>
          <br>
          <span class="pl-5 primary--text">{{ item.sensor.Sensormodel.measure }}</span>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
  <div v-else>
    <v-card light height="100%" class="text-md-center">
      <v-card-title primary class="pt-5 title">This patient does not have biometric data associated</v-card-title>
    </v-card>
  </div>
  
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      measures: [],
      selectedSensorGraph: [],
      boardSensors: [],
      chart: null,
      records: [],
      lastrecord: null,
      page: 1
    };
  },
  created() {
    this.getPatientBoards();
  },
  mounted() {
    this.getMeasures();
    if (this.selectedSensorGraph != null) {
      this.initGraph();
      this.getValues(0);
    }
  },
  methods: {
    checkNulls(sensors) {
      return sensors.sensor != null;
    },
    getPatientBoards() {
      this.boardSensors = [];
      this.$store.state.patient.Boards.forEach(board => {
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
      this.designGraph();
    },
    getValues(page) {
      event_bus.$data.http
        .get(
          "/record/sensor/" +
            this.selectedSensorGraph.sensor.id +
            "/patient/" +
            this.$store.state.patient.id +
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
    getMeasures() {
      this.measures = [];
      this.$store.state.patient.Boards.forEach(board => {
        board.Sensors.forEach(sensor => {
          this.measures.push({ text: sensor.Sensormodel.measure });
        });
      });
    }
  }
};
</script>

