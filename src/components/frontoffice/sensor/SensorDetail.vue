<template>
    <v-container class="gridSensor" >
      <v-card light>
        <v-card-title primary class="title">
          {{ this.$store.state.board.Boardmodel.name }} : {{ this.selectedSensor.Sensormodel.measure }}
          </v-card-title>
          <div v-if="records" style="height:60vh; position:relative;">
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
      this.designGraph();
      this.getValues(0);
    }
  },
  methods: {
    getValues(page) {
      if (this.$store.state.board.Boardmodel.type === "environmental") {
        event_bus.$data.http
          .get(
            "/record/sensor/" +
              this.selectedSensor.id +
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
      } else {
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
      }
    },
    initGraph() {
      this.chart = new Chart(document.getElementById(this.selectedSensor.id), {
        type: "line",
        options: {
          legend: { display: true },
          scales: { xAxes: [{ display: true }] },
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
     const colours = this.records.map(x => x.value < this.selectedSensor.Sensormodel.min_acceptable || x.value > this.selectedSensor.Sensormodel.max_acceptable ? 'rgba(206,33,33,.8)' : 'rgba(71, 183,132,.8)');
      this.chart.data.datasets = [
        // {
        //   label: this.selectedSensor.Sensormodel.measure,
        //   data: this.records.map(x => {
        //     if(x.value < this.selectedSensor.Sensormodel.min_acceptable || x.value > this.selectedSensor.Sensormodel.max_acceptable){
        //       return x.value;
        //     }

        //   }),
        //   backgroundColor: 'rgba(206,33,33,.5)',
        //   borderColor: 'rgba(206,33,33,.8)',
        //   borderWidth: 3,
        //   fill: true
        // },
        {
          label: this.selectedSensor.Sensormodel.measure,
          data: this.records.map(x => {
            // if(x.value >= this.selectedSensor.Sensormodel.min_acceptable || x.value <= this.selectedSensor.Sensormodel.max_acceptable){
              return x.value;
            // }
          }),
          pointBackgroundColor: colours,
          pointBorderColor: colours,
          borderWidth: 3,
          fill: true
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
        "-" +
        d.getDate() +
        " " +
        monthNames[d.getMonth()] +
        "'" +
        d
          .getFullYear()
          .toString()
          .substring(2)
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
  padding: 0 45px 60px 45px;
}
</style>
