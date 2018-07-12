<template>
  <div id="doctoroffice">
    
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "doctoroffice",
  data: () => {
    return {
      patients:[]
    };
  },
  created() {
    this.getPatients();
    event_bus.$on("new_patient", patient => {
      this.patients.push(patient);
    });
  },
  methods: {
    getPatients() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/doctor")
        .then(response => {
          this.patient = response.data.patients;
          if (response.data.patients.length > 0) {
            this.selectedVitabox(response.data.patients[0]);
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
    selectedVitabox(patientData) {
      this.$store.commit("setPatientData", patientData);
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