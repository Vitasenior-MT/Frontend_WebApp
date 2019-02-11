<template>
  <v-content style="height:100%" class="gridSensor">
    <v-card v-if="devices[0].board.Boardmodel.type=='environmental'" dark class="my-1 pa-3">
      <v-card-title primary-title>
        <v-layout row>
          <v-flex xs4 sm3 md3 style="position:relative">
            <img
              :src="require('@/assets/'+devices[0].sensor.Sensormodel.tag+'_icon.svg')"
              class="envIcon"
            >
          </v-flex>
          <v-flex xs8 sm9 md9 class="primary_l--text main-title">
            <v-card-title primary-title>
              <div>
                <div class="headline mb-0">{{ devices[0].sensor.Sensormodel.measure }}</div>
                <div
                  class="subheading"
                >{{ devices[0].board.description ? devices[0].board.Boardmodel.name+" - "+devices[0].board.description : devices[0].board.Boardmodel.name }}</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card-title>
    </v-card>
    <v-card v-else dark class="my-1 pa-3">
      <v-card-title primary-title>
        <div class="primary_l--text main-title">
          <div class="headline mb-0">{{ $store.state.patient.name }}</div>
          <div class="subheading">|
            <label
              v-for="device in devices"
              :key="device.sensor.id"
            >{{device.sensor.Sensormodel.measure}} |</label>
          </div>
        </div>
      </v-card-title>
    </v-card>
    <v-card v-if="devices">
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
                <v-btn slot="activator" color="primary" @click.native="getDate()" icon small>
                  <v-icon>fas fa-angle-right</v-icon>
                </v-btn>
                <span>{{$t('frontoffice.board.submit')}}</span>
              </v-tooltip>
            </div>
          </v-flex>
          <v-flex dark xs10 md3 offset-md1>
            <div class="pt-2" v-if="devices[0].board.Boardmodel.type=='environmental'">
              <v-icon small>fas fa-calendar-alt</v-icon>
              <span class="pl-1 pt-4">
                {{$t('dashboard.last_update')}}:
                <br>
                {{ new Date(devices[0].sensor.last_commit).toLocaleDateString("pt-pt", {
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
          <v-flex xs2 md1 v-if="records.length>0" class="hidden-md-and-down">
            <print-preview :records="records"></print-preview>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-text>
        <v-card height="250" light flat>
          <sensor-graph :records="records" :id="'1'"></sensor-graph>
        </v-card>

        <v-layout v-if="records" row wrap>
          <v-flex class="py-0">
            <v-btn
              v-if="records.filter(x=>x.values.length>24).length>0"
              block
              color="primary"
              flat
              @click.native="getPage(1)"
            >
              <v-icon>fas fa-angle-double-left</v-icon>
            </v-btn>
            <v-btn v-else block flat disabled>
              <v-icon>fas fa-angle-double-left</v-icon>
            </v-btn>
          </v-flex>
          <v-flex class="py-0">
            <v-btn v-if="page>1" color="primary" block flat @click.native="getPage(-1)">
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
import SensorGraph from "@/components/frontoffice/sensor/SensorGraph.vue";

export default {
  name: "sensorDetail",
  props: {
    devices: Array
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
      page: 1
    };
  },
  mounted() {
    if (this.devices && this.devices.length > 0) {
      if (this.devices[0].values && this.devices[0].values.length > 0) {
        this.records = this.devices;
      } else this.getPage(0);
    }
  },
  methods: {
    getPage(page) {
      event_bus.$emit("waiting", true);
      this.records = [];
      Promise.all(
        this.devices.map(x =>
          this.getValuesByPage(this.page + page, x.board, x.sensor)
        )
      )
        .then(records => {
          this.page += page;
          this.records = records;
          event_bus.$emit("waiting", false);
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
          event_bus.$emit("waiting", false);
        });
    },
    getValuesByPage(page, board, sensor) {
      return new Promise((resolve, reject) => {
        let url =
          board.Boardmodel.type === "environmental"
            ? "/record/sensor/" + sensor.id + "/page/" + page
            : "/record/sensor/" +
              sensor.id +
              "/patient/" +
              this.$store.state.patient.id +
              "/page/" +
              page;
        event_bus.$data.http
          .get(url)
          .then(response => {
            resolve({
              board: board,
              sensor: sensor,
              profile:
                board.Boardmodel.type === "environmental"
                  ? {
                      min: sensor.Sensormodel.min_acceptable,
                      max: sensor.Sensormodel.max_acceptable
                    }
                  : this.$store.state.patient.Profiles.find(
                      x => x.tag === sensor.Sensormodel.tag
                    ),
              values: response.data.records.sort(this.compare)
            });
          })
          .catch(error => reject(error));
      });
    },
    getDate() {
      event_bus.$emit("waiting", true);
      this.records = [];
      Promise.all(
        this.devices.map(x => this.getValuesByDate(x.board, x.sensor))
      )
        .then(records => {
          this.records = records;
          event_bus.$emit("waiting", false);
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
          event_bus.$emit("waiting", false);
        });
    },
    getValuesByDate(board, sensor) {
      return new Promise((resolve, reject) => {
        // console.log( "start: " + this.dateMin + "T" + this.timeMin, "end: " + this.dateMax + "T" + this.timeMax );
        let url =
          board.Boardmodel.type === "environmental"
            ? "/record/sensor/" +
              sensor.id +
              "/start/" +
              (this.dateMin + "T" + this.timeMin) +
              "/end/" +
              (this.dateMax + "T" + this.timeMax)
            : "/record/sensor/" +
              sensor.id +
              "/patient/" +
              this.$store.state.patient.id +
              "/start/" +
              (this.dateMin + "T" + this.timeMin) +
              "/end/" +
              (this.dateMax + "T" + this.timeMax);
        event_bus.$data.http
          .get(url)
          .then(response => {
            resolve({
              board: board,
              sensor: sensor,
              profile: this.$store.state.patient.Profiles.find(
                x => x.tag === sensor.Sensormodel.tag
              ),
              values: response.data.records.sort(this.compare)
            });
          })
          .catch(error => reject(error));
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
    },
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
    }
  },
  components: {
    "print-preview": PrintPreview,
    "sensor-graph": SensorGraph
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
