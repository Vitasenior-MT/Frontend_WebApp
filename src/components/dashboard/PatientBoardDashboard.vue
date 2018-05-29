<template>
  <v-container>
    <v-list-tile v-for="item in patientBoards.Sensors" :key="item">
        <v-list-tile-content>
            <v-list-tile-title>{{ item.Sensormodel.measure }}</v-list-tile-title>
            <v-list-tile-text>{{ item.last_commit }}</v-list-tile-text>
        </v-list-tile-content>
    </v-list-tile>
  </v-container>
</template>


<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "patientBoardDashboard",
  props: {
    selectedPatient: Object
  },
  data() {
    return {
      patientBoards: []
    };
  },
  created() {
    this.getPatientBoards();
  },
  methods: {
    getPatientBoards() {
      event_bus.$data.http
        .get("/board/" + this.$store.state.patient.id + "/patient")
        .then(response => {
          this.patientBoards = response.data.boards;
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

