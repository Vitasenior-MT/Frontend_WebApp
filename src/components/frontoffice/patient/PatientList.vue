<template>
  <div>
    <add-patient v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox"></add-patient>
    <v-data-table
      :headers="headersPatients"
      :items="this.$store.state.patients"
      class="elevation-1"
      dark
      sort-icon="fas fa-sort-down"
      next-icon="fas fa-angle-right"
      prev-icon="fas fa-angle-left"
      :rows-per-page-items="[5]"
      no-data-text="no patients registered on the vitabox"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">
          <v-icon v-if="props.item.gender == 'male'" class="cyan--text">fas fa-mars</v-icon>
          <v-icon v-if="props.item.gender == 'female'" class="pink--text">fas fa-venus</v-icon>
          <v-icon v-if="props.item.gender == 'undefined'" class="pink--text">fas fa-question</v-icon>
        </td>
        <td class="text-xs-left">{{ calculate_age(props.item.birthdate) }}</td>
        <td class="text-xs-left">
          <label v-if="props.item.weight">{{ props.item.weight }} kg</label>
          <label v-else>NaN</label>
        </td>
        <td class="text-xs-left">
          <label v-if="props.item.height">{{ props.item.height }} m</label>
          <label v-else>NaN</label>
        </td>
        <td
          class="text-xs-left"
        >{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
        <td class="text-xs-left">
          <disable-patient
            v-if="$store.state.vitabox.sponsor"
            :box="$store.state.vitabox"
            :patient="props.item"
          ></disable-patient>
          <v-tooltip bottom v-else-if="props.item.active">
            <v-icon slot="activator" dark>fas fa-play</v-icon>
            <span>active</span>
          </v-tooltip>
          <v-tooltip
            bottom
            v-else-if="!props.item.active && !props.item.weight && !props.item.height"
          >
            <v-icon slot="activator" dark>fas fa-sync-alt</v-icon>
            <span>waiting for the doctor to start activity</span>
          </v-tooltip>
          <v-tooltip bottom v-else>
            <v-icon slot="activator" dark>fas fa-pause</v-icon>
            <span>paused activity</span>
          </v-tooltip>
        </td>
        <td class="layout px-0">
          <v-tooltip bottom>
            <v-btn slot="activator" color="primary_d" @click="goToBoardDetails(props.item)">
              <v-icon>fas fa-info-circle</v-icon>
            </v-btn>
            <span>patient details</span>
          </v-tooltip>
          <remove-patient
            v-if="$store.state.vitabox.sponsor"
            :box="$store.state.vitabox"
            :patient="props.item"
          ></remove-patient>
        </td>
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
        { text: "Weight", sortable: false },
        { text: "Height", sortable: false },
        { text: "Since", sortable: false },
        { text: "State", sortable: false },
        { text: "Actions", sortable: false }
      ],
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
  mounted() {
    event_bus.$on("updatePatients", this.updatePatients);
  },
  methods: {
    calculate_age(date) {
      let today = new Date();
      let birthdate = new Date(date);
      return today.getMonth() < birthdate.getMonth() ||
        (today.getMonth() === birthdate.getMonth() &&
          today.getDate() < birthdate.getDate())
        ? today.getFullYear() - birthdate.getFullYear() - 1
        : today.getFullYear() - birthdate.getFullYear();
    },
    goToBoardDetails(patientData) {
      this.$store.commit("setPatientData", patientData);
      this.$router.push("/frontoffice/patient/detail");
    },
    updatePatients() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/patient")
        .then(response => {
          this.$store.commit("setPatientsList", response.data.patients);
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
    }
  }
};
</script>
