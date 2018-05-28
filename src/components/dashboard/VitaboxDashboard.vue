<template>
<v-container fluid grid-list-xl id="vitaboxDashboard">
      <v-layout wrap>
        <v-flex d-flex xs12 sm12 md12 lg12>
          <v-card color="grey" dark> 
            <v-layout wrap>
            <v-flex d-flex xs8 sm8 md8 lg8>
              <v-card dark>
                <v-card-title primary class="title">Patients</v-card-title>
                <v-carousel>
                    <patientDashboard v-for="item in patients" :key="item.id" :selectedPatient="item"></patientDashboard>
                </v-carousel>
              </v-card>
            </v-flex>
            <v-flex d-flex xs4 sm4 md4 lg4>
              <v-card  dark>
                <v-card-title primary class="title">Vitabox Features</v-card-title>
              </v-card>
            </v-flex>
            </v-layout>
          </v-card>
        </v-flex>  
        <v-flex d-flex xs12 sm12 md12 lg12>
          <v-card color="grey" dark>
            <v-layout wrap>
              <v-flex>
                <v-card dark tile flat>
                   <v-card-text>asfsde</v-card-text>
                </v-card>
              </v-flex>
              <v-flex>
                <v-card dark tile flat>
                   <v-card-text>asfsde</v-card-text>
                </v-card>
              </v-flex>
              <v-flex>
                <v-card dark tile flat>
                   <v-card-text>asfsde</v-card-text>
                </v-card>
              </v-flex>
              <v-flex>
                <v-card dark tile flat>
                   <v-card-text>asfsde</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex> 
        </v-layout>
    </v-container> 
</template>


<script>
import { event_bus } from "@/plugins/bus.js";
import PatientDashboard from '@/components/dashboard/PatientDashboard.vue';

export default {
  name: "vitaboxDashboard",
  props: {
      selectedVitabox: Object
  },
  data() {
    return {
      tab: null,
      boards: [],
      patients: []
    };
  },
  components: {
    patientDashboard: PatientDashboard
  },
  created() {
    this.getBoards();
    this.getPatients();
  },
  mounted() {
    this.$store.commit("setVitaboxData", this.selectedVitabox);  
  },
  methods: {
    getBoards() {
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/board")
        .then(response => {
          this.boards = response.data.boards;
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
    getPatients() {
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/patient")
        .then(response => {
          this.patients = response.data.patients;
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
