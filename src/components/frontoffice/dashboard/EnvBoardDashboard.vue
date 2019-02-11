<template>
  <v-card
    v-if="sensors.length > 0 && sensors[0].sensor"
    class="mb-1 mr-1"
    height="calc(100% - 4px)"
  >
    <v-menu
      v-model="menu"
      open-on-hover
      :right="large"
      :offset-x="large"
      :bottom="!large"
      :offset-y="!large"
      style="width:100%;height:100%;"
    >
      <div slot="activator">
        <v-card :color="getColor(avg, sensors[0].sensor)" dark height="100%" class="pa-2">
          <v-layout row wrap style="height:70%;">
            <v-flex xs4 sm3 md2 lg3>
              <img :src="require('@/assets/'+type+'_icon.svg')" class="pl-1 align-vertical-center">
            </v-flex>
            <v-flex xs8 sm9 md10 lg9>
              <v-card-title class="d-block align-vertical-center pt-1 px-0 pb-0 text-xs-center">
                <p>
                  <v-tooltip v-if="avg >-1" top slot="badge">
                    <span slot="activator">&cong;</span>
                    <span>{{ $t('dashboard.average') }}</span>
                  </v-tooltip>
                  <label
                    class="font-weight-thin"
                    style="font-size:30px;"
                  >{{ avg >-1 ? avg : 'none' }}</label>
                </p>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <label class="subheading">{{metric}}</label>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </div>
      <v-card dark>
        <v-layout row wrap>
          <v-flex
            v-for="item in sensors"
            :key="item.id"
            class="pa-1"
            style="max-width:120px;min-width:100px;"
          >
            <div v-if="item.sensor">
              <v-card
                @click.native="goToBoardDetails(item.sensor, item.board)"
                class="darken-2 sensorSelector text-xs-center"
                :color="getColor(item.sensor.last_values?item.sensor.last_values[0]:false, item.sensor)"
              >
                <v-card-text primary class="px-1">
                  <p
                    class="mb-1 title"
                  >{{ item.sensor.last_values ? item.sensor.last_values[0]:'none' }}</p>
                  {{ item.board.description }}
                </v-card-text>
              </v-card>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-menu>
  </v-card>
</template>


<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "envBoardDashboard",
  props: {
    sensors: Array,
    type: String
  },
  data: () => {
    return {
      avg: 0,
      metric: "",
      menu: false,
      large: window.innerWidth >= 1264
    };
  },
  mounted() {
    window.addEventListener(
      "resize",
      () => (this.large = window.innerWidth >= 1264)
    );
    if (this.sensors.length > 0) this.updateAvg();
  },
  beforeDestroy: function() {
    window.removeEventListener(
      "resize",
      () => (this.large = window.innerWidth >= 1264)
    );
  },
  watch: {
    sensors(x) {
      if (x.length > 0) this.updateAvg();
    }
  },
  methods: {
    updateAvg() {
      let sum = 0,
        count = 0;
      this.sensors.forEach(x => {
        if (x.sensor.last_values && x.sensor.last_values.length > 0) {
          sum += x.sensor.last_values[0];
          count++;
        }
      });
      if (count === 0) this.avg = -1;
      else this.avg = Math.round(sum / count);
      this.metric =
        this.sensors[0].sensor.Sensormodel.measure +
        " (" +
        this.sensors[0].sensor.Sensormodel.unit +
        ")";
    },
    goToBoardDetails(sensor, board) {
      this.$router.push({
        name: "FOSensorDetail",
        params: {
          devices: [
            {
              sensor: sensor,
              board: board,
              profile: {
                min: sensor.Sensormodel.min_acceptable,
                max: sensor.Sensormodel.max_acceptable
              }
            }
          ]
        }
      });
    },
    getColor(value, sensor) {
      return typeof value != "number" ||
        value > parseFloat(sensor.Sensormodel.max_acceptable) ||
        value < parseFloat(sensor.Sensormodel.min_acceptable)
        ? "red"
        : "green";
    }
  }
};
</script>

<style>
/* .envIcon {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50%;
  bottom: 50%;
  transform: translate(-50%, -50%);
} */
.iconBox {
  min-width: 40px;
  min-height: 40px;
  position: relative;
}

.sensorSelector {
  opacity: 0.9;
}

.sensorSelector:hover {
  cursor: pointer;
  opacity: 1;
}

.v-menu__content {
  min-width: 100px !important;
  max-width: 50% !important;
}

.v-menu__activator,
.v-menu__activator > div {
  width: 100%;
  height: 100%;
}
</style>
