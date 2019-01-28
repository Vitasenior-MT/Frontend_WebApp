<template>
  <div class="pr-1">
    <v-card>
      <v-list>
        <v-list-tile>
          <v-list-tile-avatar tile size="45">
            <img
              :src="require('@/assets/'+this.selectedSensorGraph.board.Boardmodel.tag+'_icon.svg')"
            >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="primary--text">
              {{ this.selectedSensorGraph.board.Boardmodel.name }}:
              <label
                class="font-weight-bold"
              >{{ this.selectedSensorGraph.sensor.Sensormodel.measure.toUpperCase() }}</label>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <v-tooltip bottom class="hidden-sm-and-down">
                <v-icon slot="activator" small>fas fa-calendar-alt</v-icon>
                <span>Última actualização</span>
              </v-tooltip>
              <span
              >{{selectedSensorGraph.sensor.last_commit ?formatDate(selectedSensorGraph.sensor.last_commit):"NaN"}}</span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip bottom>
              <v-btn
                icon
                slot="activator"
                @click.native="goToBoardDetails(selectedSensorGraph.board, selectedSensorGraph.sensor, selectedPatient)"
              >
                <v-icon color="blue darken-2">fas fa-info-circle</v-icon>
              </v-btn>
              <span>Sensor Details</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card>
    <v-card class="bioGraphCard my-1 hidden-sm-and-down" light flat>
      <div v-if="records" id="bioGraph" class="pa-1">
        <canvas id="graphCanvas" ref="graphCanvas"></canvas>
      </div>
    </v-card>
    <v-layout row wrap>
      <v-flex xs6 md3 lg4 xl3 v-for="item in boardSensors" :key="item.id">
        <v-list light class="py-0 patientBoardSelector" style="height:60px;">
          <v-list-tile
            class="px-0 py-1"
            :color="verifyValue(item.sensor)"
            @click.native="showGraph(item)"
          >
            <v-list-tile-avatar size="30" tile class="bioGraphAvatarCard">
              <img
                class="bioLogo"
                :src="require('@/assets/'+item.board.Boardmodel.tag+'_icon.svg')"
              >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title
                class="font-weight-bold"
              >{{ item.sensor.last_values ? item.sensor.last_values[0]+item.sensor.Sensormodel.unit : 'none' }}</v-list-tile-title>
              <v-list-tile-sub-title class="primary--text">{{ item.sensor.Sensormodel.measure }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Chart from "chart.js";
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "patientDashboard",
  props: {
    selectedPatient: Object
  },
  data: () => {
    return {
      selectedSensorGraph: null,
      patientBoards: [],
      boardSensors: [],
      chart: null,
      records: [],
      range: null
    };
  },
  created() {
    this.$store.commit("setPatientData", this.selectedPatient);
    this.getPatientBoards();
  },
  mounted() {
    if (this.selectedSensorGraph != null) {
      this.initGraph();
    }
  },
  watch: {
    selectedPatient(val) {
      this.getPatientBoards();
      if (this.selectedSensorGraph != null) {
        this.getValues();
      }
    },
    selectedSensorGraph(val) {
      this.range = this.selectedPatient.Profiles.filter(
        x => x.tag === val.sensor.Sensormodel.tag
      )[0];
    }
  },
  methods: {
    getPatientBoards() {
      this.boardSensors = [];
      this.selectedPatient.Boards.forEach(board => {
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
      this.getValues();
    },
    getValues() {
      event_bus.$data.http
        .get(
          "/record/sensor/" +
            this.selectedSensorGraph.sensor.id +
            "/patient/" +
            this.selectedPatient.id +
            "/page/1"
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
    },
    initGraph() {
      this.chart = new Chart(this.$refs.graphCanvas, {
        type: "line",
        options: {
          legend: { display: false },
          scales: { xAxes: [{ display: false }] },
          responsive: true,
          maintainAspectRatio: false
        }
      });
      this.getValues();
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
          data: this.records.map(x => {
            return x.value;
          }),
          pointBackgroundColor: colors,
          pointBorderColor: colors,
          borderWidth: 3
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
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
    },
    goToBoardDetails(boardData, sensorData, patientData) {
      this.$store.commit("setPatientData", patientData);
      this.$router.push({
        name: "FOSensorDetail",
        params: { sensor: sensorData, board: boardData }
      });
    },
    verifyValue(sensor) {
      let profile = this.selectedPatient.Profiles.filter(
        x => x.tag === sensor.Sensormodel.tag
      )[0];
      if (
        sensor.last_values &&
        profile.max > sensor.last_values[0] &&
        profile.min < sensor.last_values[0]
      )
        return "green accent-4";
      else return "red accent-4";
    }
  }
};
</script>

<style>
.bioAvatar {
  padding-top: 10%;
  padding-left: 10px;
}

.bioLogo {
  height: 40px;
  width: 40px;
}

.bioGraphCard {
  padding-right: 10px;
  height: 100%;
}

#bioGraph {
  height: 240px;
  position: relative;
}

.bioGraphAvatarCard {
  min-width: 40px;
}

.patientBoardSelector {
  -moz-box-shadow: inset 0 0 10px #fff;
  -webkit-box-shadow: inset 0 0 10px #fff;
  background-color: #dfdfdf !important;
  box-shadow: inset 0 0 5px #fff;
}

.patientBoardSelector:hover {
  cursor: pointer;
  background-color: #cfcfcf !important;
}
</style>
