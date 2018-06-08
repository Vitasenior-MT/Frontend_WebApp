<template>
    <v-container class="gridSensor">
    <v-list>
        <v-list-tile>
            <v-list-tile-content>
            <v-list-tile-title>{{ this.selectedSensor.Sensormodel.measure }}</v-list-tile-title>
            </v-list-tile-content>      
        </v-list-tile>
        <v-divider inset></v-divider>
    </v-list>
    <v-card light>
        <div v-if="records" style="height:350px; position:relative;">
        <canvas :id=" this.selectedSensor.id"></canvas>
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
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import Chart from "chart.js";

export default {
  name: "sensorDetail",
  props: {
    selectedSensor: Object
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
  watch: {
    selectedSensor(val) {
      this.initGraph();
      this.getValues(0);
    }
  },
  methods: {
    getValues(page) {
      event_bus.$data.http
        .get(
          "/record/sensor/" +
            this.selectedSensor.id +
            "/patient/" +
            this.$store.state.patient.id +
            "/page/" +
            (this.page + page)
        )
        .then(response => {
          this.records = response.data.records.sort(this.compare);
          console.log(this.records);
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
        document.getElementById(this.selectedSensor.id),
        {
          type: "line",
          options: {
            legend: { display: false },
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
          label: this.selectedSensor.Sensormodel.measure,
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
            i => this.selectedSensor.Sensormodel.min_acceptable
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
            i => this.selectedSensor.Sensormodel.max_acceptable
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

.gridSensor {
  padding: 0 45px 60px 45px !important; 
}

</style>
