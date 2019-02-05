<template>
  <v-content style="height:100%" class="gridSensor">
    <v-card v-if="sensor" dark class="my-1 pa-3">
      <v-card-title primary-title>
        <v-layout row>
          <v-flex xs4 sm3 md3 style="position:relative">
            <img
              :src="board.Boardmodel.type=='environmental'?require('@/assets/'+sensor.Sensormodel.tag+'_icon.svg'):require('@/assets/'+board.Boardmodel.tag+'_icon.svg')"
              class="envIcon"
            >
          </v-flex>
          <v-flex xs8 sm9 md9 class="primary_l--text main-title">
            <v-card-title primary-title>
              <div>
                <div class="headline mb-0">{{ sensor.Sensormodel.measure }}</div>
                <div
                  class="subheading"
                >{{ board.description?board.Boardmodel.name+" - "+board.description:board.Boardmodel.name }}</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card-title>
    </v-card>

    <v-card v-if="sensor">
      <v-card-title>
        <v-layout row class="mx-4 pt-2">
          <v-flex sm6 md3>
            <v-menu
              ref="menu1"
              :close-on-content-click="false"
              v-model="menu1"
              :nudge-right="40"
              :return-value.sync="date1"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="date1"
                :label="$t(' dashboard.start_date')"
                prepend-icon="far fa-calendar"
                readonly
              ></v-text-field>
              <v-date-picker
                v-if="flag1 == false"
                v-model="date1"
                min="2000-01-01"
                :max="new Date().toISOString().substr(0, 10)"
                locale="pt-pt"
                @change="flag1=true"
                no-title
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
              ></v-date-picker>
              <v-time-picker
                v-if="flag1 == true"
                v-model="time1"
                format="24hr"
                @change="saveTime1(date1, time1)"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex sm6 md3>
            <v-menu
              ref="menu2"
              :close-on-content-click="false"
              v-model="menu2"
              :nudge-right="40"
              :return-value.sync="date2"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="date2"
                :label="$t(' dashboard.end_date')"
                prepend-icon="far fa-calendar"
                readonly
              ></v-text-field>
              <v-date-picker
                v-if="flag2 == false"
                v-model="date2"
                :min="dateMin"
                :max="new Date().toISOString().substr(0, 10)"
                locale="pt-pt"
                @change="flag2=true"
                no-title
                prev-icon="fas fa-angle-left"
                next-icon="fas fa-angle-right"
              ></v-date-picker>
              <v-time-picker
                v-if="flag2 == true"
                v-model="time2"
                :min="checkTimeMin()"
                format="24hr"
                @change="saveTime2(date2, time2)"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex md1>
            <div class="pt-2">
              <v-tooltip bottom>
                <v-btn
                  slot="activator"
                  color="primary"
                  @click.native="getValuesByDate()"
                  icon
                  small
                >
                  <v-icon>fas fa-angle-right</v-icon>
                </v-btn>
                <span>{{$t('frontoffice.board.submit')}}</span>
              </v-tooltip>
            </div>
          </v-flex>
          <v-flex dark xs10 md3 offset-md1>
            <div class="pt-2">
              <v-icon small>fas fa-calendar-alt</v-icon>
              <span class="pl-1 pt-4">
                {{$t('dashboard.last_update')}}:
                <br>
                {{ new Date(sensor.last_commit).toLocaleDateString("pt-pt", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
                }) }}
              </span>
            </div>
          </v-flex>
          <v-flex xs2 md1>
            <print-preview :records="records" :sensor="sensor" :range="range"></print-preview>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-text>
        <div v-if="range" class="pl-5 pb-2">
          <v-chip small label>
            <v-avatar>
              <v-icon small color="blue darken-3">fas fa-circle</v-icon>
            </v-avatar>
            {{ $t('dashboard.minimum_acceptable') + " (" + Math.round(this.range.min) + ")"}}
          </v-chip>
          <v-chip small label>
            <v-avatar>
              <v-icon small color="deep-orange darken-2">fas fa-circle</v-icon>
            </v-avatar>
            {{ $t('dashboard.maximum_acceptable') + " (" + Math.round(this.range.max) + ")"}}
          </v-chip>
        </div>

        <div class="sensorGraph">
          <canvas id="graphCanvas" ref="graphCanvas"></canvas>
        </div>

        <v-layout v-if="records" row wrap>
          <v-flex class="py-0">
            <v-btn
              v-if="records.length>24"
              block
              color="primary"
              flat
              @click.native="getValuesByPage(1)"
            >
              <v-icon>fas fa-angle-double-left</v-icon>
            </v-btn>
            <v-btn v-else block flat disabled>
              <v-icon>fas fa-angle-double-left</v-icon>
            </v-btn>
          </v-flex>
          <v-flex class="py-0">
            <v-btn v-if="page>1" color="primary" block flat @click.native="getValuesByPage(-1)">
              <v-icon>fas fa-angle-double-right</v-icon>
            </v-btn>
            <v-btn v-else block flat disabled>
              <v-icon>fas fa-angle-double-right</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import PrintPreview from "@/components/frontoffice/sensor/SensorPrint.vue";

export default {
  name: "sensorDetail",
  props: {
    sensor: Object,
    board: Object
  },
  data: () => {
    return {
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
      page: 1,
      range: null
    };
  },
  mounted() {
    if (this.sensor && this.board) {
      this.initGraph();
      this.range =
        this.board.Boardmodel.type !== "environmental"
          ? this.$store.state.patient.Profiles.filter(
              x => x.tag === this.sensor.Sensormodel.tag
            )[0]
          : {
              min: this.sensor.Sensormodel.min_acceptable,
              max: this.sensor.Sensormodel.max_acceptable
            };
    }
  },
  watch: {
    sensor(val) {
      this.getValuesByPage(0);
    }
  },
  methods: {
    initGraph() {
      this.chart = new Chart(this.$refs.graphCanvas, {
        type: "line",
        options: {
          legend: { display: false },
          scales: { xAxes: [{ display: true }] },
          responsive: true,
          maintainAspectRatio: false
        }
      });
      this.getValuesByPage(0);
    },
    designGraph() {
      let length = this.records.length;
      this.chart.data.labels = this.records.map(x => {
        return this.formatDate(x.datetime);
      });
      let colors = this.records.map(x =>
        x.value < this.range.min || x.value > this.range.max
          ? "rgba(206,33, 33,.8)"
          : "rgba(71, 183, 132,.8)"
      );

      this.chart.data.datasets = [
        {
          data: this.records.map(x => x.value),
          pointBackgroundColor: colors,
          pointBorderColor: colors,
          borderWidth: 3,
          fill: true
        },
        {
          data: Array.from({ length }, i => this.range.min),
          borderWidth: 2,
          fill: false,
          borderColor: "#1565C0",
          pointRadius: 0
        },
        {
          data: Array.from({ length }, i => this.range.max),
          borderWidth: 2,
          fill: false,
          borderColor: "#E64A19",
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
        " - " +
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
    getValuesByPage(page) {
      let url =
        this.board.Boardmodel.type === "environmental"
          ? "/record/sensor/" + this.sensor.id + "/page/" + (this.page + page)
          : "/record/sensor/" +
            this.sensor.id +
            "/patient/" +
            this.$store.state.patient.id +
            "/page/" +
            (this.page + page);
      event_bus.$data.http
        .get(url)
        .then(response => {
          this.records = response.data.records.sort(this.compare);
          this.page += page;
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
    },
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
    },
    getValuesByDate() {
      // console.log(
      //   "start: " + this.dateMin + "T" + this.timeMin,
      //   "end: " + this.dateMax + "T" + this.timeMax
      // );
      let url =
        this.board.Boardmodel.type === "environmental"
          ? "/record/sensor/" +
            this.sensor.id +
            "/start/" +
            (this.dateMin + "T" + this.timeMin) +
            "/end/" +
            (this.dateMax + "T" + this.timeMax)
          : "/record/sensor/" +
            this.sensor.id +
            "/patient/" +
            this.$store.state.patient.id +
            "/start/" +
            (this.dateMin + "T" + this.timeMin) +
            "/end/" +
            (this.dateMax + "T" + this.timeMax);

      event_bus.$data.http
        .get(url)
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
    },
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
      let currentdate = new Date();
      return (
        currentdate.getFullYear() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getDate()
      );
    }
  },
  components: {
    "print-preview": PrintPreview
  }
};
</script>

<style>
.gridSensor {
  padding: 0 45px 60px 45px;
}

.sensorGraph {
  height: 35vh;
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
