<template>
    <v-container>
        <v-card dark tile flat >
        <v-card-title>{{ this.$store.state.sensor.Sensormodel.measure }}</v-card-title>
        <v-card-text>{{ this.$store.state.sensor.last_commit }}</v-card-text>
    </v-card>
    </v-container>
   
</template>


<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "envBoardDashboard",
  props: {
    selectedVitaboxBoard: Object
  },
  data() {
    return {
      boardSensors: []
    };
  },
  created() {
    this.getBoardSensors();
    console.log(this.$store.state.sensor.last_commit);
  },
  methods: {
    getBoardSensors() {
      event_bus.$data.http
        .get("/board/" + this.$store.state.vitaboxBoard.id + "/sensor")
        .then(response => {
          this.boardSensors = response.data.boards;
          this.$store.commit("setSensorData", boardSensors);
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

<style>
</style>
