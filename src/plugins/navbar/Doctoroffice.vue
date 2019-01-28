<template>
  <div id="doctoroffice">
    <div class="primary">
      <v-btn dark depressed class="my-0 primary--text" block to="/doctoroffice/requests">Requests
        <v-spacer></v-spacer>
        <v-icon v-if="count>0" right small dark>fas fa-bell</v-icon>
      </v-btn>
    </div>
    <div class="primary">
      <v-autocomplete
        class="px-3 pt-2 mt-0 white--text"
        color="raven"
        v-model="model"
        :items="patients"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        item-text="name"
        placeholder="Start typing to Search"
        prepend-icon="fas fa-search"
        append-icon="fas fa-angle-down"
        return-object
      ></v-autocomplete>
    </div>
    <v-divider class="patientDivider"></v-divider>
    <v-list class="office_menu py-0" three-line>
      <router-link
        v-for="(item, index) in patients"
        :key="item.id"
        @click.native="selectedPatient(item)"
        :to="'/doctoroffice/dashboard'"
      >
        <v-divider v-if="index !== 0" class="patientDivider" inset :key="index"></v-divider>
        <v-list-tile class="patientSelector">
          <v-list-tile-avatar class="primary--text">
            <v-icon>fa fa-user</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="primary--text">Patient</v-list-tile-title>
            <v-list-tile-sub-title class="white--text" small>{{ getPatientName(item) }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </router-link>
    </v-list>
    <v-divider class="patientDivider"></v-divider>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "doctoroffice",
  data: () => {
    return {
      patients: [],
      isLoading: false,
      model: null,
      search: null,
      count: 0
    };
  },
  created() {
    this.getPatients();
    this.getRequestCount();
    event_bus.$on("new_patient", () => {
      this.getPatients();
      this.count--;
    });
    event_bus.$on("update_patient", patient => {
      this.updatePatient(patient);
    });
  },
  methods: {
    getPatients() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/doctor/patient")
        .then(response => {
          this.patients = response.data.patients;
          this.$store.commit("setPatientsList", response.data.patients);
          if (response.data.patients.length > 0) {
            this.selectedPatient(response.data.patients[0]);
          }
          event_bus.$emit("waiting", false);
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
          event_bus.$emit("waiting", false);
        });
    },
    getRequestCount() {
      event_bus.$data.http
        .get("/doctor/request/count")
        .then(response => {
          this.count = response.data.count;
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
    },
    selectedPatient(patientData) {
      this.$store.commit("setPatientData", patientData);
    },
    updatePatient(patient) {
      this.patients.forEach(x => {
        if (x.id === patient.id) x = patient;
      });
    },
    getPatientName(item) {
      return (
        item.Vitabox.locality
          .replace(/_/g, " ")
          .split(" ")
          .map(x => x[0].toUpperCase() + x.substr(1))
          .join(" ") +
        " - " +
        item.name
      );
    }
  }
};
</script>

<style>
.patientSelector:hover {
  background-color: #5b5b5b !important;
}

.patientDivider {
  background-color: white !important;
}
</style>