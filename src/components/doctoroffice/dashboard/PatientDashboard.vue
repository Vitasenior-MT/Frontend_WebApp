<template>
  <div class="pr-1">
    <v-card height="230" class="hidden-sm-and-down" light flat>
      <sensor-graph :records="devices.filter(y => y.selected)" :id="'1'"></sensor-graph>
    </v-card>

    <v-layout wrap row class="pt-1">
      <v-flex xs10 sm11>
        <v-layout wrap row>
          <v-flex xs12 sm6 md4 lg6 xl4 v-for="device in devices" :key="device.id">
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
                    <v-list-tile-sub-title
                      class="primary--text"
                    >{{ device.sensor.Sensormodel.measure }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action v-if="device.sensor.last_commit" class="raven--text">
                    <v-list-tile-action-text>{{countTime(device.sensor.last_commit)}}</v-list-tile-action-text>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs2 sm1 class="pb-1">
        <v-tooltip v-if="devices.length>0" bottom style="height:100%;">
          <v-card
            slot="activator"
            @click.native="goToBoardDetails()"
            class="text-xs-center"
            style="height:100%;align-items: center;"
          >
            <v-icon class="align-vertical-center" large color="primary">fas fa-chevron-right</v-icon>
          </v-card>
          <span>{{ $t('dashboard.sensor_details') }}</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SensorGraph from "@/components/frontoffice/sensor/SensorGraph.vue";

export default {
  name: "patientDashboard",
  data: () => {
    return {
      selectedDevice: null,
      devices: []
    };
  },
  mounted() {
    this.getPatientBoards();
  },
  computed: {
    selectedPatient() {
      return this.$store.state.patient;
    }
  },
  watch: {
    selectedPatient(val) {
      if (val) this.getPatientBoards();
    }
  },
  methods: {
    getPatientBoards() {
      this.devices = [];
      this.selectedPatient.Boards.forEach(board => {
        board.Sensors.forEach(sensor => {
          this.devices.push({
            board: board,
            sensor: sensor,
            profile: this.selectedPatient.Profiles.find(
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
            this.selectedPatient.id +
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
          devices: this.devices.filter(y => y.selected)
        }
      });
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
    compare(a, b) {
      if (a.datetime < b.datetime) return -1;
      if (a.datetime > b.datetime) return 1;
      return 0;
    },
    countTime(date) {
      let diff = Math.floor((Date.now() - new Date(date)) / 3600000);
      if (diff < 24)
        if (diff > 1) return diff + "h";
        else return "< 1h";
      else return Math.floor(diff / 24) + " " + this.$t("dashboard.days");
    }
  },
  components: {
    "sensor-graph": SensorGraph
  }
};
</script>

<style>
.selectedBorder {
  border: 2px solid #424242;
  -moz-box-shadow: 2px 4px 8px #424242;
  -webkit-box-shadow: 2px 4px 8px #424242;
  box-shadow: 2px 4px 8px #424242;
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
