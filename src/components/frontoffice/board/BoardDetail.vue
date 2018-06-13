<template>
    <v-content>
      <v-list dark>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Location</v-list-tile-title>
            <v-icon v-if="this.$store.state.board.Boardmodel.name == null">fas fa-times-circle</v-icon> 
              {{ $store.state.board.Boardmodel.name }}
          </v-list-tile-content>
          <v-list-tile-content >
            <v-list-tile-title>MAC</v-list-tile-title>
            {{ $store.state.board.mac_addr }}
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title>Active</v-list-tile-title>
            <v-icon v-if="this.$store.state.board.active === true">fas fa-check-circle</v-icon> 
            <v-icon v-else>fas fa-times-circle</v-icon> 
          </v-list-tile-content>
          <v-list-tile-content >
            <v-list-tile-title>Last Update</v-list-tile-title>
            {{ $store.state.board.updated_at }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-flex wrap>
          <v-card dark v-if="sensors.length > 0">
              <v-carousel lazy :cycle="false" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" delimiter-icon="fas fa-circle" style="height:75vh">
                <v-carousel-item v-for="item in sensors" :key="item.id" >
                  <sensorDetail :selectedSensor="item"></sensorDetail>
                </v-carousel-item>
              </v-carousel>
          </v-card>
      </v-flex>
      <v-flex style="margin-bottom: 40px">
        <v-btn dark @click="$router.go(-1)">
          <v-icon>fas fa-long-arrow-alt-left </v-icon>
        </v-btn>
      </v-flex>
    </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SensorDetail from "../sensor/SensorDetail.vue";

export default {
  data() {
    return {
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
      //event_bus.$emit("waiting", true);
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
          //event_bus.$emit("waiting", false);
        });
    }
  }
};
</script>