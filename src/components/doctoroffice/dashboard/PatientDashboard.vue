<template>
  <div>
    <v-card color="transparent" v-if="selectedSensorGraph" class="bioGraphCard" light flat>
      <v-layout row id="graphHeader">
        <v-avatar tile class="pa-4" size="35px"><img :src="require('@/assets/' + selectedSensorGraph.board.Boardmodel.tag + '_icon.svg')"></v-avatar>
        <span class="title pa-3 primary--text"> {{ selectedSensorGraph.board.Boardmodel.name }} : {{ selectedSensorGraph.sensor.Sensormodel.measure }}</span>
        <v-spacer></v-spacer>
        <div class="pa-3" v-if="selectedSensorGraph.sensor.last_commit">
          <v-icon small>fas fa-calendar-alt</v-icon>
          <span>Última actualização: {{ new Date(selectedSensorGraph.sensor.last_commit).toLocaleDateString("pt-pt", options) }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-tooltip bottom >
          <v-btn slot="activator" color="primary_d" @click.native='goToBoardDetails(selectedSensorGraph.board, selectedSensorGraph.sensor)'>
            <v-icon>fas fa-info-circle</v-icon>
          </v-btn>
          <span>Sensor Details</span>
        </v-tooltip>
      </v-layout>
      <v-alert v-if="norecords" :value="true" color="error" icon="fas fa-exclamation-triangle"> No records </v-alert>
      <div v-else>
        <v-layout>
          <canvas id="selectedSensorGraph" height="250px"></canvas>
        </v-layout>
        <v-layout row wrap>
          <v-flex class="py-0">
            <v-btn v-if="records.length>24" block color="primary" flat @click.native="getValues(1, null)"><v-icon>fas fa-angle-double-left</v-icon></v-btn>
            <v-btn v-else block flat disabled><v-icon>fas fa-angle-double-left</v-icon></v-btn>
          </v-flex>
          <v-flex class="py-0">
            <v-btn v-if="page>1" color="primary" block flat @click.native="getValues(-1, null)"><v-icon>fas fa-angle-double-right</v-icon></v-btn>
            <v-btn v-else block flat disabled><v-icon>fas fa-angle-double-right</v-icon></v-btn>
          </v-flex>
        </v-layout>
      </div>
      <v-layout wrap justify-center class="pt-1 ml-1 mb-1">
        <v-flex xs12 sm12 md4 lg2 v-for="item in boardSensors" :key="item.id">
          <v-card class="patientBoardSelector" light flat style="height:100%; padding-bottom:10px;" @click.native="getValues(0,item)">
            <v-avatar tile class="bioAvatar" style="padding-left:10px;"><img class="bioLogo" :src="require('@/assets/'+item.board.Boardmodel.tag+'_icon.svg')"></v-avatar>
            <span class="title" style="color:#3faf7d; padding-left:10px;">{{ item.sensor.last_values ? item.sensor.last_values[item.sensor.last_values.length-1] : 'none' }}</span>
            <br>
            <span class="pl-5 primary--text">{{ item.sensor.Sensormodel.measure }}</span>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card v-else light height="100%" class="text-md-center">
      <v-card-title primary class="title">This patient does not have biometric data associated</v-card-title>
    </v-card>
  </div>
  
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  props: {
    patient: Object
  },
  data() {
    return {
      selectedSensorGraph: null,
      boardSensors: [],
      chart: null,
      records: [],
      page: 1,
      norecords: false
    };
  },
  mounted() {
    if (this.patient && this.patient.Boards.length > 0) {
      event_bus.$emit("waiting", true);
      this.getBoardSensors();
    }
  },
  watch: {
    patient(val) {
      this.boardSensors = [];
      if (val && val.Boards.length > 0) {
        event_bus.$emit("waiting", true);
        this.getBoardSensors();
      } else {
        this.selectedSensorGraph = null;
      }
    }
  },
  methods: {
    getBoardSensors() {
      this.$store.state.patient.Boards.forEach(board => {
        board.Sensors.forEach(sensor => {
          this.boardSensors.push({
            board: board,
            sensor: sensor
          });
        });
      });
      if (this.boardSensors.length > 0) {
        this.getValues(0, this.boardSensors[0]);
      } else event_bus.$emit("waiting", false);
    },
    getValues(page, boardsensor) {
      if (boardsensor) this.selectedSensorGraph = boardsensor;
      this.records = [];
      event_bus.$data.http
        .get(
          "/record/sensor/" +
            this.selectedSensorGraph.sensor.id +
            "/patient/" +
            this.patient.id +
            "/page/" +
            (this.page + page)
        )
        .then(response => {
          if (response.data.records.length > 0) {
            this.records = response.data.records.sort(this.compare);
            this.page += page;
            this.norecords = false;
            this.initGraph();
          } else {
            this.norecords = true;
            event_bus.$emit("waiting", false);
          }
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", {
              message: error.message,
              type: "error"
            });
          }
          this.norecords = true;
          event_bus.$emit("waiting", false);
        });
    },
    initGraph() {
      this.chart = new Chart(
        document.getElementById("selectedSensorGraph").getContext("2d"),
        {
          type: "line",
          options: {
            legend: { display: true },
            scales: { xAxes: [{ display: false }] },
            responsive: true,
            maintainAspectRatio: false
          },
          data: {
            labels: this.records.map(x => {
              return this.formatDate(x.datetime);
            }),
            datasets: [
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
                  { length: this.records.length },
                  i =>
                    this.selectedSensorGraph.sensor.Sensormodel.min_acceptable
                ),
                borderWidth: 3,
                fill: false,
                borderColor: "rgba(58, 100, 252, 1)",
                pointRadius: 0
              },
              {
                label: "maximum acceptable",
                data: Array.from(
                  { length: this.records.length },
                  i =>
                    this.selectedSensorGraph.sensor.Sensormodel.max_acceptable
                ),
                borderWidth: 3,
                fill: false,
                borderColor: "rgba(255, 83, 35, 1)",
                pointRadius: 0
              }
            ]
          }
        }
      );
      event_bus.$emit("waiting", false);
    },
    // designGraph() {
    //   this.chart.data.labels = this.records.map(x => {
    //     return this.formatDate(x.datetime);
    //   });
    //   this.chart.data.datasets = [
    //     {
    //       label: this.selectedSensorGraph.sensor.Sensormodel.measure,
    //       data: this.records.map(x => {
    //         return x.value;
    //       }),
    //       backgroundColor: "rgba(71, 183,132,.5)",
    //       borderColor: "#47b784",
    //       borderWidth: 3
    //     },
    //     {
    //       label: "minimum acceptable",
    //       data: Array.from(
    //         { length: this.records.length },
    //         i => this.selectedSensorGraph.sensor.Sensormodel.min_acceptable
    //       ),
    //       borderWidth: 3,
    //       fill: false,
    //       borderColor: "rgba(58, 100, 252, 1)",
    //       pointRadius: 0
    //     },
    //     {
    //       label: "maximum acceptable",
    //       data: Array.from(
    //         { length: this.records.length },
    //         i => this.selectedSensorGraph.sensor.Sensormodel.max_acceptable
    //       ),
    //       borderWidth: 3,
    //       fill: false,
    //       borderColor: "rgba(255, 83, 35, 1)",
    //       pointRadius: 0
    //     }
    //   ];
    //   this.chart.update();
    //   event_bus.$emit("waiting", false);
    // },
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
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
    },
    goToBoardDetails(boardData, sensorData) {
      this.$store.commit("setBoardData", boardData);
      this.$store.commit("setSensorData", sensorData);
      this.$router.push("/doctoroffice/board/detail");
    }
  }
};
</script>

<style>
#recordsChart {
  position: relative;
}
#graphHeader {
  background-color: white;
}
</style>
