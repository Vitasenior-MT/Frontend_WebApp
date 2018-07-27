<template>
    <v-content style="height:100%">
      <v-flex xs12 class="pa-0">
        <v-layout class="text-md-center">
          <v-card dark width="100%" class="pt-1" flat>
            <v-card-title primary-title>
              <div>
                <h1 class="primary_l--text main-title mb-0">
                  Board - 
                  <span class="thin">
                    {{ this.$store.state.board.Boardmodel.name}}
                  </span>
                </h1>
              </div>
            </v-card-title>
          </v-card>
        </v-layout>
      </v-flex>
      <v-flex xs12 class="pb-2">
        <v-list dark >
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">Location</v-list-tile-sub-title>
              <v-list-tile-title v-if="this.$store.state.board.description == null">Body</v-list-tile-title>
              <v-list-tile-title v-else>{{ $store.state.board.description }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content >
              <v-list-tile-sub-title class="primary--text">MAC</v-list-tile-sub-title>
              <v-list-tile-title>{{ $store.state.board.mac_addr }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">Active</v-list-tile-sub-title>
              <v-list-tile-title v-if="this.$store.state.board.active === true"><v-icon >fas fa-check-circle</v-icon> </v-list-tile-title>
              <v-list-tile-title  v-else><v-icon>fas fa-times-circle</v-icon> </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">Last Update</v-list-tile-sub-title>
              <v-list-tile-title>{{ new Date(this.$store.state.board.updated_at).toLocaleDateString("pt-pt", options) }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex wrap>
          <v-card dark v-if="sensors.length > 0">
              <v-carousel lazy :cycle="false" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" delimiter-icon="fas fa-circle" style="height:75%" hide-delimiters>
                <v-carousel-item v-for="item in sensors" :key="item.id">
                  <sensorDetail :selectedSensor="item"></sensorDetail>
                </v-carousel-item>
              </v-carousel>
          </v-card>
      </v-flex>
      <v-flex class="pb-2 pt-1">
        <v-btn dark class="ml-0" @click="$router.go(-1)">
          <v-icon>fas fa-long-arrow-alt-left </v-icon> <span class="pl-1"> Go Back</span>
        </v-btn>
      </v-flex>
    </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SensorDetail from "@/components/frontoffice/sensor/SensorDetail.vue";

export default {
  data() {
    return {
      options: { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
      sensors: []
    };
  },
  components: {
    sensorDetail: SensorDetail
  },
  created() {
    this.getSensors();
  },
  methods: {
    getSensors() {
      event_bus.$data.http
        .get("/board/" + this.$store.state.board.id + "/sensor")
        .then(response => {
          this.sensors = response.data.sensors;
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", { message: error.message, type: "error" });
          }
        });
    }
  }
};
</script>

<style >

</style>
