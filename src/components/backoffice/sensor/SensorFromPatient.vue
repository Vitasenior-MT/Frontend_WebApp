<template>
  <v-card flat class="ash_l">
    <v-card-title class="pb-1">
      <p class="title">{{sensor.Sensormodel.transducer}} - {{sensor.Sensormodel.measure}}</p>
    </v-card-title>
    <v-card-text class="py-0">
      <table style="width:100%">
        <tr>
          <td class="text-xs-right"><label class="primary_d--text mr-2">last commit</label></td>
          <th class="text-xs-left">
            <label v-if="sensor.last_commit">{{getTime(sensor.last_commit)}}</label>
            <label v-else>NaN</label>
          </th>
        </tr>
        <tr>
          <td class="text-xs-right"><label class="primary_d--text mr-2">id</label></td>
          <th class="text-xs-left" colspan="2">{{sensor.id}}</th>
        </tr>
      </table>
      <div v-if="records" style="height: 250px;position:relative;">
        <canvas class="sensor_graph" :id="sensor.id"></canvas>
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
    </v-card-text>
  </v-card>
</template>

<script>
import Chart from "chart.js";
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "sensor_graph",
  props: {
    sensor: Object,
    patient: String
  },
  data: () => {
    return {
      chart: null,
      records: [],
      page: 1
    };
  },
  mounted() {
    this.initGraph();
    this.getValues(0);
  },
  methods: {
    getValues(page) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get(
          "/record/sensor/" +
            this.sensor.id +
            "/patient/" +
            this.patient +
            "/page/" +
            (this.page + page)
        )
        .then(response => {
          this.records = response.data.records.sort(this.compare);
          this.page += page;
          this.designGraph();
          event_bus.$emit("waiting", false);
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("error", error.response.data);
          } else {
            event_bus.$emit("error", error.message);
          }
          event_bus.$emit("waiting", false);
        });
    },
    initGraph() {
      this.chart = new Chart(document.getElementById(this.sensor.id), {
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
          label: this.sensor.Sensormodel.measure,
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
            i => this.sensor.Sensormodel.min_acceptable
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
            i => this.sensor.Sensormodel.max_acceptable
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