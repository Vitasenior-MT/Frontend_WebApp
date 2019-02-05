<template>
  <div>
    <v-card class="mr-1">
      <v-bottom-nav :active.sync="selectedPatientId" value height="77">
        <v-btn v-for="item in patients" :key="item.id" :value="item.id">
          <span>{{item.name}}</span>
          <v-avatar size="45">
            <img v-if="item.photo" :src="getPhotoLink(item.photo)">
            <v-icon v-else>fas fa-user-circle</v-icon>
          </v-avatar>
        </v-btn>
      </v-bottom-nav>
    </v-card>

    <v-layout row wrap class="pt-1">
      <v-flex md6 v-if="selectedPatientId">
        <v-card @click.native="goToPatientProfile()" dark class="mb-1 mr-1">
          <v-list two-line class="dark-hover">
            <v-list-tile>
              <v-list-tile-avatar size="50" class="no-min-width">
                <img
                  v-if="selectedPatientId && $store.state.patient.photo"
                  :src="getPhotoLink($store.state.patient.photo)"
                >
                <v-icon large v-else>fas fa-user-circle</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content class="pl-1">
                <v-list-tile-title
                  class="headline primary_l--text"
                  style="height:auto;"
                >{{ this.$store.state.patient.name}}</v-list-tile-title>
                <v-list-tile-sub-title class="asg--text caption">{{ this.$store.state.patient.id}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action class="no-min-width">
                <v-tooltip bottom>
                  <v-icon slot="activator" color="blue lighten-1">fa fa-chevron-right</v-icon>
                  <span>{{ $t('dashboard.patient_details') }}</span>
                </v-tooltip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex md6>
        <v-card v-if="selectedDevice" @click.native="goToBoardDetails()" class="mr-1">
          <v-list two-line class="light-hover">
            <v-list-tile>
              <v-list-tile-avatar tile size="45">
                <img :src="require('@/assets/'+selectedDevice.board.Boardmodel.tag+'_icon.svg')">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="primary--text">
                  {{ selectedDevice.board.Boardmodel.name }}:
                  <label
                    class="font-weight-bold"
                  >{{ selectedDevice.sensor.Sensormodel.measure.toUpperCase() }}</label>
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-tooltip bottom class="hidden-sm-and-down">
                    <v-icon slot="activator" small>fas fa-calendar-alt</v-icon>
                    <span>{{ $t('dashboard.last_update') }}</span>
                  </v-tooltip>
                  <span>{{selectedDevice.sensor.last_commit ?formatDate(selectedDevice.sensor.last_commit):"NaN"}}</span>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-tooltip bottom>
                  <v-icon slot="activator" color="blue darken-1">fas fa-chevron-right</v-icon>
                  <span>{{ $t('dashboard.sensor_details') }}</span>
                </v-tooltip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

    <v-card height="250" class="hidden-sm-and-down mr-1" light flat>
      <sensor-graph :records="devices.filter(y => y.selected)" :id="'1'"></sensor-graph>
    </v-card>

    <v-layout wrap row class="pt-1">
      <v-flex xs12 sm4 md3 xl2 v-for="device in devices" :key="device.id">
        <v-card class="mr-1 mb-1">
          <v-list
            light
            :class="device.selected?'py-0 primary-hover':'py-0 light-hover'"
            style="height:60px;"
          >
            <v-list-tile
              class="px-0 py-2"
              :color="verifyValue(device.profile)"
              @click.native="selectDevice(device)"
            >
              <v-list-tile-avatar size="30" tile>
                <img :src="require('@/assets/'+device.board.Boardmodel.tag+'_icon.svg')">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title
                  class="font-weight-bold"
                >{{ device.profile.last_values ? device.profile.last_values[0] + device.sensor.Sensormodel.unit : 'NaN' }}</v-list-tile-title>
                <v-list-tile-sub-title class="ash--text">{{ device.sensor.Sensormodel.measure }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SensorGraph from "@/components/frontoffice/sensor/SensorGraph.vue";

export default {
  name: "patientDashboard",
  props: {
    patients: Array
  },
  data: () => {
    return {
      selectedDevice: null,
      devices: [],
      selectedPatientId: null
    };
  },
  watch: {
    patients() {
      this.selectPatient();
    },
    selectedPatientId(id) {
      if (id) {
        this.$store.commit(
          "setPatientData",
          this.patients.find(x => x.id === id)
        );
        this.devices = [];
        this.getPatientBoards();
      }
    }
  },
  mounted() {
    this.selectPatient();
  },
  methods: {
    selectPatient() {
      if (this.patients && this.patients.length > 0) {
        this.selectedPatientId = this.patients[0].id;
      } else {
        this.$store.commit("setPatientData", null);
        this.selectedPatientId = null;
      }
    },
    getPatientBoards() {
      this.$store.state.patient.Boards.forEach(board => {
        board.Sensors.forEach(sensor => {
          this.devices.push({
            board: board,
            sensor: sensor,
            profile: this.$store.state.patient.Profiles.find(
              x => x.tag === sensor.Sensormodel.tag
            ),
            selected: false,
            values: []
          });
        });
      });
      this.selectedDevice = this.devices[0];
      this.getValues();
    },
    selectDevice(item) {
      this.selectedDevice = item;
      let count = this.devices.filter(y => y.selected).length;
      let found = this.devices.map(x => {
        if (x.sensor.id === item.sensor.id) {
          if (!(!x.selected && count === 3)) {
            if (x.values.length < 1) this.getValues();
            else x.selected = !x.selected;
          } else {
            event_bus.$emit("toast", {
              message: "limit of selected sensors exceeded",
              type: "error"
            });
          }
        }
      });
    },
    getValues() {
      event_bus.$data.http
        .get(
          "/record/sensor/" +
            this.selectedDevice.sensor.id +
            "/patient/" +
            this.selectedPatientId +
            "/page/1"
        )
        .then(response => {
          this.devices.map(x => {
            if (x.sensor.id === this.selectedDevice.sensor.id) {
              x.values = response.data.records.sort(this.compare);
              x.selected = !x.selected;
            }
          });
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
    goToBoardDetails() {
      this.$router.push({
        name: "FOSensorDetail",
        params: {
          sensor: this.selectedDevice.sensor,
          board: this.selectedDevice.board
        }
      });
    },
    goToPatientProfile() {
      this.$router.push("/frontoffice/patient/detail");
    },
    verifyValue(profile) {
      if (
        profile.last_values &&
        profile.max > profile.last_values[0] &&
        profile.min < profile.last_values[0]
      )
        return "green accent-4";
      else return "red accent-4";
    },
    getPhotoLink(photo) {
      return event_bus.$data.url + "/file/" + photo;
    },
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
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
    }
  },
  components: {
    "sensor-graph": SensorGraph
  }
};
</script>

<style>
.v-item-group.v-bottom-nav {
  bottom: auto;
  transform: none;
}

.theme--light.v-bottom-nav .v-btn:not(.v-btn--active) span {
  font-weight: normal !important;
}
.theme--light.v-bottom-nav .v-btn:not(.v-btn--active) img {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  width: 36px !important;
  height: 36px !important;
}
.theme--light.v-bottom-nav .v-btn:not(.v-btn--active) .v-icon {
  font-size: 36px !important;
}

.theme--light.v-bottom-nav .v-btn span {
  font-weight: bold;
}
.theme--light.v-bottom-nav .v-btn img {
  margin-bottom: 4px;
}
.theme--light.v-bottom-nav .v-btn .v-icon {
  font-size: 45px;
}
</style>
