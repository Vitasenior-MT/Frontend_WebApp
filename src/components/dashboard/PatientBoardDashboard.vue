<template>
    <v-list-tile @click="goToPatientProfile($store.state.patient.id)">
        <v-list-tile-content>
            <v-list-tile-title>{{ $store.state.patient.name }}</v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>
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

