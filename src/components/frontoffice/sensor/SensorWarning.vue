<template>
  <v-card>
    <v-list v-if="sensor" dark>
      <v-list-tile>
        <v-list-tile-avatar>
          <img
            :src="board.Boardmodel.type=='environmental'?require('@/assets/'+sensor.Sensormodel.tag+'_icon.svg'):require('@/assets/'+board.Boardmodel.tag+'_icon.svg')"
            class="envIcon"
          >
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title style="height:32px !important">
            <label class="headline primary--text">{{ sensor.Sensormodel.measure }}</label>
            <label
              class="subheading ash_l--text"
            >( {{ board.description?board.Boardmodel.name+" - "+board.description:board.Boardmodel.name }} )</label>
          </v-list-tile-title>
          <v-list-tile-sub-title>{{patient_id?$t('dashboard.last_values',{days:7}):$t('dashboard.last_values',{days:2})}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon @click="close">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <div v-if="range" class="pl-5 pb-2 d-flex">
      <v-chip label style="flex: 0 0 auto !important;">
        <v-avatar>
          <v-icon small color="blue darken-3">fas fa-circle</v-icon>
        </v-avatar>
        {{ $t('dashboard.minimum_acceptable') + " (" + Math.round(this.range.min) + ")"}}
      </v-chip>
      <v-chip label style="flex: 0 0 auto !important;">
        <v-avatar>
          <v-icon small color="deep-orange darken-2">fas fa-circle</v-icon>
        </v-avatar>
        {{ $t('dashboard.maximum_acceptable') + " (" + Math.round(this.range.max) + ")"}}
      </v-chip>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <v-btn slot="activator" icon style="flex:0 0 auto !important" @click="goToBoardDetails">
          <v-icon color="info">fas fa-chevron-right</v-icon>
        </v-btn>
        <span>{{$t('dashboard.sensor_details')}}</span>
      </v-tooltip>
    </div>

    <div class="sensorGraph">
      <canvas id="graphCanvas" ref="graphCanvas"></canvas>
    </div>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "sensorWarning",
  props: {
    sensor_id: String,
    patient_id: String,
    warning_date: Date
  },
  data: () => {
    return {
      chart: null,
      records: [],
      range: null,
      board: null,
      sensor: null,
      patient: null
    };
  },
  mounted() {
    this.initGraph();
    if (this.sensor_id && this.warning_date) {
      if (this.patient_id) this.getPatient();
      else this.getSensor();
    }
  },
  watch: {
    sensor_id(val) {
      if (val && this.warning_date) {
        if (this.patient_id) this.getPatient();
        else this.getSensor();
      }
    },
    patient_id(val) {
      if (this.sensor_id && this.warning_date) {
        if (val) this.getPatient();
        else this.getSensor();
      }
    },
    warning_date(val) {
      if (this.sensor_id && val) {
        if (this.patient_id) this.getPatient();
        else this.getSensor();
      }
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
    },
    getSensor() {
      event_bus.$data.http
        .get("/sensor/" + this.sensor_id)
        .then(response => {
          this.sensor = response.data.sensor;
          this.board = this.sensor.Board;
          this.setRange();
          this.getValuesByDate();
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
    getPatient() {
      event_bus.$data.http
        .get("/patient/" + this.patient_id + "/info")
        .then(response => {
          response.data.patient.Boards.forEach(board =>
            board.Sensors.forEach(sensor => {
              if (sensor.id === this.sensor_id) {
                this.sensor = sensor;
                this.board = board;
              }
            })
          );
          this.patient = response.data.patient;
          this.$store.commit("setPatientData", this.patient);
          this.setRange();
          this.getValuesByDate();
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
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
    },
    getValuesByDate() {
      let first_date = new Date(),
        last_date = new Date(),
        url = "";

      if (this.patient_id) {
        first_date.setDate(this.warning_date.getDate() - 7);
        last_date.setDate(this.warning_date.getDate() + 1);
        url =
          "/record/sensor/" +
          this.sensor_id +
          "/patient/" +
          this.patient_id +
          "/start/" +
          first_date.toISOString() +
          "/end/" +
          last_date.toISOString();
      } else {
        first_date.setDate(this.warning_date.getDate() - 2);
        last_date.setDate(this.warning_date.getDate() + 1);
        url =
          "/record/sensor/" +
          this.sensor_id +
          "/start/" +
          first_date.toISOString() +
          "/end/" +
          last_date.toISOString();
      }
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
    setRange() {
      this.range =
        this.board.Boardmodel.type !== "environmental"
          ? this.patient.Profiles.filter(
              x => x.tag === this.sensor.Sensormodel.tag
            )[0]
          : {
              min: this.sensor.Sensormodel.min_acceptable,
              max: this.sensor.Sensormodel.max_acceptable
            };
    },
    close() {
      this.$store.commit("setPatientData", null);
      this.$emit("close");
    },
    goToBoardDetails() {
      this.$router.push({
        name: "FOSensorDetail",
        params: {
          devices: [
            {
              sensor: this.sensor,
              board: this.board,
              profile: this.range
            }
          ]
        }
      });
    }
  }
};
</script>

<style>
.sensorGraph {
  height: 35vh;
  position: relative;
}

.envIcon {
  width: 40px;
  height: 40px;
}
</style>