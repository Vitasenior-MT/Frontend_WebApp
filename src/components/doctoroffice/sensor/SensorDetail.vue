<template>
  <v-container class="gridSensor">
    <v-card light flat>
      <v-card dark flat>
        <v-flex xs12 class="pa-0">
          <v-layout class="pl-3 pr-3 text-md-center">
            <v-card dark width="100%" class="pb-1" flat>
              <v-card-title primary-title>
                <div>
                  <h1 class="primary_l--text main-title mb-0">
                    Sensor - 
                    <span class="thin">
                      {{ this.selectedSensor.Sensormodel.measure }}
                    </span>
                  </h1>
                </div>
              </v-card-title>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout>
            <v-avatar class="pl-2 pt-2">
              <img v-if="selectedSensor.Sensormodel.measure == 'temperatura'" src="@/assets/temp_icon.svg">
              <img v-if="selectedSensor.Sensormodel.measure == 'humidade'" src="@/assets/humi_icon.svg">
              <img v-if="selectedSensor.Sensormodel.measure == 'monox. carbono (ppm)'" src="@/assets/mono_icon.svg">
              <img v-if="selectedSensor.Sensormodel.measure == 'CO2'" src="@/assets/diox_icon.svg">
            </v-avatar>
            <span class="pl-2 pt-3 title primary--text">{{ this.$store.state.board.Boardmodel.name }} : {{ this.selectedSensor.Sensormodel.measure }}</span>
            <v-spacer></v-spacer>
            <v-icon small>fas fa-calendar-alt</v-icon>
            <span class="pl-1 pt-4"> Última actualização:  {{ this.lastrecord }} </span>
            <v-spacer></v-spacer>
            <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" :return-value.sync="date1" lazy transition="scale-transition" offset-y full-width min-width="290px" >
              <v-text-field slot="activator" v-model="date1" label="Pick Start Date" prepend-icon="far fa-calendar" readonly ></v-text-field>
              <v-date-picker v-if="flag1 == false" v-model="date1" min="2000-01-01" :max="new Date().toISOString().substr(0, 10)" locale="pt-pt" @change="flag1=true" no-title  prev-icon="fas fa-angle-left" next-icon="fas fa-angle-right"> </v-date-picker>
              <v-time-picker v-if="flag1 == true" v-model="time1" format="24hr" @change="saveTime1(date1, time1)"></v-time-picker>
            </v-menu>
            <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" :return-value.sync="date2" lazy transition="scale-transition" offset-y full-width min-width="290px" >
              <v-text-field slot="activator" v-model="date2" label="Pick End Date" prepend-icon="far fa-calendar" readonly ></v-text-field>
              <v-date-picker v-if="flag2 == false" v-model="date2" :min="this.dateMin" :max="new Date().toISOString().substr(0, 10)" locale="pt-pt" @change="flag2=true" no-title  prev-icon="fas fa-angle-left" next-icon="fas fa-angle-right"> </v-date-picker>
              <v-time-picker v-if="flag2 == true" v-model="time2" :min="checkTimeMin()" format="24hr" @change="saveTime2(date2, time2)"></v-time-picker>
            </v-menu>
            <v-btn color="primary" @click.native="updateGraph()">Go</v-btn>
          </v-layout>
        </v-flex>
      </v-card>
      <div v-if="records" class="sensorGraph">
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
      options: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      },
      flag1: false,
      date1: null,
      menu1: false,
      time1: null,
      dateMin: null,
      timeMin: null,
      flag2: false,
      date2: null,
      menu2: false,
      time2: null,
      datetime2: null,
      chart: null,
      records: [],
      lastrecord: null,
      page: 1
    };
  },
  mounted() {
    this.initGraph();
    this.getValues(0);
  },
  watch: {
    datetime2(val) {},
    selectedSensor(val) {
      this.designGraph();
      this.getValues(0);
    }
  },
  methods: {
    saveTime1(date, time) {
      this.flag1 = false;
      var datetime = date + " " + time;
      this.$refs.menu1.save(datetime);
      this.dateMin = date;
      this.timeMin = time;
    },
    checkTimeMin() {
      if (this.dateMin != this.date2) {
        return "0:00";
      } else {
        return this.timeMin;
      }
    },
    saveTime2(date, time) {
      this.flag2 = false;
      var datetime = date + " " + time;
      this.$refs.menu2.save(datetime);
    },
    getCurrentTime() {
      var currentdate = new Date();
      var datetime =
        currentdate.getFullYear() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getDate();
      return datetime;
    },
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
      const colours = this.records.map(
        x =>
          x.value < this.selectedSensor.Sensormodel.min_acceptable ||
          x.value > this.selectedSensor.Sensormodel.max_acceptable
            ? "rgba(206,33,33,.8)"
            : "rgba(71, 183,132,.8)"
      );
      this.chart.data.datasets = [
        {
          label: this.selectedSensor.Sensormodel.measure,
          data: this.records.map(x => {
            return x.value;
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
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
    },
    updateGraph() {
      if (this.$store.state.board.Boardmodel.type === "environmental") {
        event_bus.$data.http
          .get(
            "/record/sensor/" +
              this.selectedSensor.id +
              "/start/" +
              (this.dateMin + "T" + this.timeMin) +
              "/end/" +
              (this.dateMax + "T" + this.timeMax)
          )
          .then(response => {
            this.records = response.data.records.sort(this.compare);
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
              "/start/" +
              (this.dateMin + "T" + this.timeMin) +
              "/end/" +
              (this.dateMax + "T" + this.timeMax)
          )
          .then(response => {
            this.records = response.data.records.sort(this.compare);
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
    }
  }
};
</script>

<style>
.gridSensor {
  padding: 0 45px 60px 45px;
}

.sensorGraph {
  height: 50vh;
  position: relative;
}
</style>
