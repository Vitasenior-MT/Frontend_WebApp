<template>
  <div>
    <add-patient v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" @addpatient="(patient)=>patients.push(patient)"></add-patient>
      <v-data-table :headers="headersPatients" :items="patients" hide-actions class="elevation-1" dark sort-icon="fas fa-sort-down">
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">
            <v-icon v-if="props.item.gender == 'male'" class="cyan--text">fas fa-mars</v-icon>
            <v-icon v-if="props.item.gender == 'female'" class="pink--text">fas fa-venus</v-icon>
            <v-icon v-if="props.item.gender == 'undefined'" class="pink--text">fas fa-times-circle</v-icon>
          </td>
          <td class="text-xs-left">{{ calculate_age(props.item.birthdate) }}</td>
          <td class="text-xs-left">{{ props.item.birthdate }}</td>
          <td class="text-xs-left">{{ props.item.weight }} kg</td>
          <td class="text-xs-left">{{ props.item.height }} m</td>
          <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
          <td class="text-xs-left">
            <disable-patient v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" :patient="props.item"></disable-patient>
            <v-icon small v-else-if="props.item.active">fas fa-play</v-icon>
            <v-icon small v-else>fas fa-pause</v-icon>
          </td>
          <td class="layout px-0">
            <v-btn color="primary_d" @click='goToBoardDetails(props.item)'><v-icon>fas fa-info-circle</v-icon></v-btn>
            <remove-patient v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" :patient="props.item" @remove="()=>patients.splice(patients.indexOf(props.item), 1)"></remove-patient>
          </td>
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">no data to display here</v-alert>
        </template>
      </v-data-table>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import PatientAdd from "@/components/frontoffice/patient/PatientAdd.vue";
import PatientDisable from "@/components/frontoffice/patient/PatientDisable.vue";
import PatientRemove from "@/components/frontoffice/patient/PatientRemove.vue";

export default {
  components: {
    "add-patient": PatientAdd,
    "disable-patient": PatientDisable,
    "remove-patient": PatientRemove
  },
  data() {
    return {
      headersPatients: [
        { text: "Name", value: "name", sortable: true },
        { text: "Gender", sortable: false },
        { text: "Age", sortable: false },
        { text: "Birthdate", sortable: false },
        { text: "Weight", sortable: false },
        { text: "Height", sortable: false },
        { text: "Since", sortable: false },
        { text: "State", sortable: false },
        { text: "Actions", sortable: false }
      ],
      patients: [],
      options: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      }
    };
  },
  created() {
    this.getPatients();
  },
  methods: {
    calculate_age(dob) {
      dob = new Date(dob);
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    },
    getPatients() {
      this.patients = [];
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/patient")
        .then(response => {
          this.patients = response.data.patients;
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
    goToBoardDetails(patientData) {
      this.$store.commit("setPatientData", patientData);
      this.$router.push("/frontoffice/patient/detail");
    }
  }
};
</script>
