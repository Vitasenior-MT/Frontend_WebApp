<template>
  <v-content style="height:100%">
    <v-container class="gridSensor">
      <v-card v-if="sensor" dark class="my-1 pa-3">
        <v-card-title primary-title>
          <v-layout row>
            <v-flex xs4 sm3 md3 style="position:relative">
              <img :src="board.Boardmodel.type=='environmental'?require('@/assets/'+sensor.Sensormodel.tag+'_icon.svg'):require('@/assets/'+board.Boardmodel.tag+'_icon.svg')" class="envIcon">
            </v-flex>
            <v-flex xs8 sm9 md9 class="primary_l--text main-title">
              <v-card-title primary-title>
                <div>
                  <div class="headline mb-0">{{ sensor.Sensormodel.measure }}</div>
                  <div class="subheading">{{ board.description?board.Boardmodel.name+" - "+board.description:board.Boardmodel.name }}</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>

      <v-card v-if="sensor">
        <v-card-title>
          <v-layout row class="mx-4 pt-2">
            <v-flex dark sm12 md4>
              <v-icon small>fas fa-calendar-alt</v-icon>
              <span class="pl-1 pt-4"> Última actualização:<br />{{  new Date(sensor.last_commit).toLocaleDateString("pt-pt", options) }} </span>
            </v-flex>
            <v-flex sm6 md3>       
              <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" :return-value.sync="date1" lazy transition="scale-transition" offset-y full-width min-width="290px" >
                <v-text-field slot="activator" v-model="date1" label="Pick Start Date" prepend-icon="far fa-calendar" readonly ></v-text-field>
                <v-date-picker v-if="flag1 == false" v-model="date1" min="2000-01-01" :max="new Date().toISOString().substr(0, 10)" locale="pt-pt" @change="flag1=true" no-title  prev-icon="fas fa-angle-left" next-icon="fas fa-angle-right"> </v-date-picker>
                <v-time-picker v-if="flag1 == true" v-model="time1" format="24hr" @change="saveTime1(date1, time1)"></v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex sm6 md3> 
              <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" :return-value.sync="date2" lazy transition="scale-transition" offset-y full-width min-width="290px" >
                <v-text-field slot="activator" v-model="date2" label="Pick End Date" prepend-icon="far fa-calendar" readonly ></v-text-field>
                <v-date-picker v-if="flag2 == false" v-model="date2" :min="dateMin" :max="new Date().toISOString().substr(0, 10)" locale="pt-pt" @change="flag2=true" no-title  prev-icon="fas fa-angle-left" next-icon="fas fa-angle-right"> </v-date-picker>
                <v-time-picker v-if="flag2 == true" v-model="time2" :min="checkTimeMin()" format="24hr" @change="saveTime2(date2, time2)"></v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex md2> 
              <v-btn color="primary" @click.native="updateGraph()">Go</v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-card-text>
          <div class="sensorGraph">
            <canvas :id="sensor.id"></canvas>
          </div>
          
          <v-layout v-if="records" row wrap>
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

      <v-btn dark class="ml-0" @click="$router.go(-1)">
        <v-icon>fas fa-long-arrow-alt-left </v-icon> <span class="pl-1"> Go Back</span>
      </v-btn>
    </v-container>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "sensorDetail",
  props: {
    sensor: Object,
    board: Object
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
    if (this.sensor) {
      this.initGraph();
    }
  },
  watch: {
    sensor(val) {
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
      this.dateMax = date;
      this.timeMax = time;
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
      if (this.board.Boardmodel.type === "environmental") {
        event_bus.$data.http
          .get(
            "/record/sensor/" + this.sensor.id + "/page/" + (this.page + page)
          )
          .then(response => {
            this.records = response.data.records.sort(this.compare);
            this.page += page;
            this.designGraph();
            this.lastrecord = new Date(
              this.records[this.records.length - 1].datetime
            ).toLocaleDateString("pt-pt", this.options);
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
          });
      } else {
        event_bus.$data.http
          .get(
            "/record/sensor/" +
              this.sensor.id +
              "/patient/" +
              this.$store.state.patient.id +
              "/page/" +
              (this.page + page)
          )
          .then(response => {
            this.records = response.data.records.sort(this.compare);
            this.page += page;
            this.designGraph();
            this.lastrecord = new Date(
              this.records[this.records.length - 1].datetime
            ).toLocaleDateString("pt-pt", this.options);
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
          });
      }
    },
    initGraph() {
      this.chart = new Chart(document.getElementById(this.sensor.id), {
        type: "line",
        options: {
          legend: { display: true },
          scales: { xAxes: [{ display: true }] },
          responsive: true,
          maintainAspectRatio: false
        }
      });
      this.getValues(0);
    },
    designGraph() {
      let length = this.records.length;
      this.chart.data.labels = this.records.map(x => {
        return this.formatDate(x.datetime);
      });
      const colours = this.records.map(
        x =>
          x.value < this.sensor.Sensormodel.min_acceptable ||
          x.value > this.sensor.Sensormodel.max_acceptable
            ? "rgba(206,33,33,.8)"
            : "rgba(71, 183,132,.8)"
      );
      this.chart.data.datasets = [
        {
          label: this.sensor.Sensormodel.measure,
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
      console.log(
        "start: " + this.dateMin + "T" + this.timeMin,
        "end: " + this.dateMax + "T" + this.timeMax
      );
      if (this.board.Boardmodel.type === "environmental") {
        event_bus.$data.http
          .get(
            "/record/sensor/" +
              this.sensor.id +
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
          });
      } else {
        event_bus.$data.http
          .get(
            "/record/sensor/" +
              this.sensor.id +
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

.envIcon {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50%;
  bottom: 50%;
  transform: translate(-50%, -50%);
}
</style>
