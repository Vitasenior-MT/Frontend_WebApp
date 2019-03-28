<template>
  <div>
    <v-card class="mr-1">
      <div id="patient_selector">
        <v-btn v-for="(patient, index) in patients" :key="patient.id" @click="selectPatient(index)">
          <span>{{patient.name}}</span>
          <v-avatar size="47">
            <img v-if="patient.photo" :src="getPhotoLink(patient.photo)">
            <v-icon v-else>fas fa-user-circle</v-icon>
          </v-avatar>
        </v-btn>
      </div>
    </v-card>

    <v-layout row wrap class="pt-1" fill-height>
      <div
        :class="devices.length>0?'flex xs10 md11':'flex xs12'"
        xs10
        md11
        v-if="this.$store.state.patient"
      >
        <v-card @click.native="goToPatientProfile()" dark class="mb-1 mr-1">
          <v-list two-line class="dark-hover">
            <v-list-tile>
              <v-list-tile-avatar size="50" class="no-min-width">
                <img
                  v-if="this.$store.state.patient.photo"
                  :src="getPhotoLink(this.$store.state.patient.photo)"
                >
                <v-icon large v-else>fas fa-user-circle</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content class="pl-2">
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
      </div>

      <v-flex v-if="devices.length>0" sx2 md1 class="mb-1">
        <v-tooltip bottom style="height:100%;">
          <v-card
            slot="activator"
            @click.native="goToBoardDetails()"
            class="mr-1 text-xs-center"
            style="height:100%;align-items: center;"
          >
            <v-icon class="align-vertical-center" large color="primary">fas fa-info-circle</v-icon>
          </v-card>
          <span>{{ $t('dashboard.sensor_details') }}</span>
        </v-tooltip>
      </v-flex>
      <v-flex v-else xs12>
        <v-card color="error" class="mr-1" height="100%">
          <v-card-title>{{$t('dashboard.no_boards')}}</v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <div v-if="devices.length>0">
      <v-card height="250" class="hidden-sm-and-down mr-1" light flat>
        <sensor-graph :records="devices.filter(y => y.selected)" :id="'1'"></sensor-graph>
      </v-card>

      <v-layout wrap row class="pt-1">
        <v-flex xs12 sm6 md4 xl3 v-for="device in devices" :key="device.id">
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
                <v-list-tile-avatar size="30" tile class="env_avatar">
                  <img :src="require('@/assets/'+device.board.Boardmodel.tag+'_icon.svg')">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title
                    class="font-weight-bold"
                  >{{ (device.profile.last_values && device.profile.last_values.length>0) ? device.profile.last_values[0] + device.sensor.Sensormodel.unit : $t('dashboard.none') }}</v-list-tile-title>
                  <v-list-tile-sub-title class="ash--text">{{ device.sensor.Sensormodel.measure }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action class="raven--text">
                  <v-list-tile-action-text>{{countTime(device.board.last_commit)}}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
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
      devices: [],
      selectedPatientId: null,
      now: new Date().getHours()
    };
  },
  watch: {
    patients() {
      this.selectPatient(0);
    }
  },
  mounted() {
    this.selectPatient(0);
  },
  methods: {
    selectPatient(index) {
      if (this.patients && this.patients.length > 0) {
        var btns = document
          .getElementById("patient_selector")
          .querySelectorAll("BUTTON");
        btns.forEach(x => (x.className = "v-btn theme--light"));
        btns[index].className = "v-btn theme--light v-btn--active";

        this.$store.commit("setPatientData", this.patients[index]);
        this.devices = [];
        this.getPatientBoards();
      } else {
        this.$store.commit("setPatientData", null);
      }
    },
    getPatientBoards() {
      this.$store.state.patient.Boards.forEach(board => {
        board.Sensors.forEach(sensor => {
          let profile_to_send = null,
            profile = this.$store.state.patient.Profiles.find(
              x => x.tag === sensor.Sensormodel.tag
            );
          if (this.now >= 9 && this.now < 18) {
            profile_to_send = {
              min: profile.min_diurnal,
              max: profile.max_diurnal,
              last_values: profile.last_values
            };
          } else {
            profile_to_send = {
              min: profile.min_nightly,
              max: profile.max_nightly,
              last_values: profile.last_values
            };
          }
          this.devices.push({
            board: board,
            sensor: sensor,
            profile: profile_to_send,
            selected: false,
            values: []
          });
        });
      });
      this.selectDevice(this.devices[0]);
    },
    selectDevice(item) {
      let count = this.devices.filter(y => y.selected).length;
      this.devices.map((x, i) => {
        if (x.sensor.id === item.sensor.id) {
          if (!(!x.selected && count === 3)) {
            if (x.values.length < 1) this.getValues(item, i);
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
    getValues(selectedDevice, index) {
      event_bus.$data.http
        .get(
          "/record/sensor/" +
            selectedDevice.sensor.id +
            "/patient/" +
            this.$store.state.patient.id +
            "/page/1"
        )
        .then(response => {
          this.devices[index].values = response.data.records.sort(this.compare);
          this.devices[index].selected = !this.devices[index].selected;
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
    countTime(date) {
      if (date) {
        let diff = Math.floor((Date.now() - new Date(date)) / 3600000);
        if (diff < 24)
          if (diff > 1) return diff + "h";
          else return "< 1h";
        else return Math.floor(diff / 24) + " " + this.$t("dashboard.days");
      } else return "NaN";
    }
  },
  components: {
    "sensor-graph": SensorGraph
  }
};
</script>

<style>
#patient_selector {
  height: 97px;
  box-shadow: 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  display: flex;
  left: 0;

  width: 100%;
  overflow-x: auto;
}
@media only screen and (max-width: 703px) {
  #patient_selector {
    justify-content: normal;
  }
}
@media only screen and (min-width: 703px) {
  #patient_selector {
    justify-content: center;
  }
}

#patient_selector button {
  background: transparent !important;
  box-shadow: none !important;
  height: 100%;
  margin: 0;
  max-width: 168px;
  min-width: 80px;
  padding: 8px 12px 10px;
  width: 100%;
  text-transform: none;
}

#patient_selector .v-btn--active::before {
  background-color: #fff !important;
}
#patient_selector button .v-btn__content {
  flex-direction: column-reverse;
}

#patient_selector button:not(.v-btn--active) img {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  width: 36px !important;
  height: 36px !important;
}
#patient_selector button:not(.v-btn--active) span {
  font-weight: normal;
}
#patient_selector button:not(.v-btn--active) .v-icon {
  font-size: 36px !important;
  color: #4f4f4f !important;
}

#patient_selector button span {
  font-weight: bold;
}
#patient_selector button img {
  margin-bottom: 4px;
}
#patient_selector button .v-icon {
  font-size: 45px;
}
</style>
