<template>
  <v-card tile id="vitabox_patients">
    
    <v-card-title>
      <span class="headline">Patients</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="px-5">
      <v-expansion-panel focusable v-if="patients.length>0" popout>
        <v-expansion-panel-content v-for="patient in patients" :key="patient.id" expand-icon="fas fa-caret-down">
          <div slot="header" class="raven--text subheading mb-0">{{patient.name}}</div>
          <v-card>
            <patient-details :patient="patient" @remove="()=>patients.splice(patients.indexOf(patient), 1)"></patient-details>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <div v-else class="subheading text-xs-center warning--text">This vitabox has no patients</div>
    </v-card-text>

  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import PatientDetails from "@/components/backoffice/patient/PatientDetails.vue";

export default {
  name: "vitabox_patients",
  props: {
    vitabox: Object
  },
  data: () => {
    return {
      patients: []
    };
  },
  created() {
    this.getPatients(this.vitabox.id);
  },
  watch: {
    vitabox(val) {
      this.getPatients(val.id);
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getPatients(vitabox_id) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + vitabox_id + "/patient")
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
            event_bus.$emit("toast", {
              message: error.message,
              type: "error"
            });
          }
          event_bus.$emit("waiting", false);
        });
    }
  },
  components: {
    "patient-details": PatientDetails
  }
};
</script>

