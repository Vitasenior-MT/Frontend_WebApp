<template>
    <div style="margin-top:80px; margin-left:10px; margin-right:10px">
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Location</v-list-tile-title>
            <v-icon v-if="this.$store.state.vitaboxBoard.description == null">mdi-close</v-icon> 
              {{ $store.state.vitaboxBoard.description }}
          </v-list-tile-content>
          <v-list-tile-content >
            <v-list-tile-title>MAC</v-list-tile-title>
            {{ $store.state.vitaboxBoard.mac_addr }}
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title>Active</v-list-tile-title>
            <v-icon v-if="this.$store.state.vitaboxBoard.active === true">mdi-check</v-icon> 
            <v-icon v-else>mdi-close</v-icon> 
          </v-list-tile-content>
          <v-list-tile-content >
            <v-list-tile-title>Last Update</v-list-tile-title>
            {{ $store.state.vitaboxBoard.updated_at }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-flex style="margin-bottom: 40px">
        <v-btn @click="$router.go(-1)">
          <v-icon >mdi-keyboard-return</v-icon>
        </v-btn>
      </v-flex>
    </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
      sensors: [],
    };
  },
  created() {
    this.getSensors();
  },
  methods: {
    getSensors() {
      event_bus.$data.http.get("/board/" + this.$store.state.vitaboxBoard.id + "/sensor").then(response => {
        this.sensors = response.data.sensors;
        console.log(this.$store.state.board.location);
      });
    },
    goToSensorDetails(sensorData) {
      this.$store.commit("setSensorData", sensorData);
      this.$router.push("/sensor/detail");
    }
  }
};
</script>