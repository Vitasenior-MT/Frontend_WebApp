<template>
    <div>
        <p>The Board Detail Page</p>
        <v-list>
        <v-list-tile>
          <v-list-tile-content>id: {{ $store.state.board.id }}</v-list-tile-content>
          <v-list-tile-content>address: {{ $store.state.board.location }}</v-list-tile-content>
          <v-list-tile-content>registered: {{ $store.state.board.mac_addr }}</v-list-tile-content>
          <v-list-tile-content>active: {{ $store.state.board.active }}</v-list-tile-content>
          <v-list-tile-content>active: {{ $store.state.board.updated_at }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
      <br>
      <v-list-tile v-for="item in sensors" :key="item.id">
          <v-list-tile-content>id: {{ item.id }}</v-list-tile-content>
          <v-list-tile-content>last_commit: {{ item.last_commit }}</v-list-tile-content>
          <v-list-tile-content>last_values: {{ item.last_values }}</v-list-tile-content>
    </v-list-tile>
    <br>
    <a @click="$router.go(-1)">back</a>
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
      event_bus.$data.http.get("/board/" + this.$store.state.board.id + "/sensor").then(response => {
        this.sensors = response.data.sensors;
      });
    },
    goToSensorDetails(sensorData) {
      this.$store.commit("setSensorData", sensorData);
      this.$router.push("/sensor/detail");
    }
  }
};
</script>