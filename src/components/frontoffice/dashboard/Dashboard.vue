<template>
  <v-container id="dashboardMain" class="dashboardMain" fluid grid-list-sm align-center>
    <v-layout wrap>
      <v-flex xs12 sm12 md12 lg8 sl9>
        <v-layout class="text-md-left">
          <v-card dark style="width:100%; height:56px;">
          <v-avatar style="color:#3faf7d; ">
            <v-icon>fa fa-compass</v-icon>
          </v-avatar>
            <span style="color:#3faf7d;">Location:</span>
            <span style="padding-left:50px;">{{ this.$store.state.vitabox.address }}</span>
          </v-card>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4 sl3>
        <v-layout class="text-md-center">
          <v-card class="vitaboxDetailsSelector" dark style="height:56px; width:100%; padding-top:12px; padding-bottom:12px;" align-content-center align-center @click.native='goToVitaboxDetails($store.state.vitabox)'>
            <span class="white--text" style="padding-right:50px;">
                <v-icon color="primary" style="width:50px;">fas fa-info-circle</v-icon> Press for more details
            </span>
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>  
    <vitaboxDashboard :selectedVitabox="$store.state.vitabox"></vitaboxDashboard>
  </v-container>  
</template>

<script>
import VitaboxDashboard from "./VitaboxDashboard.vue";
import { event_bus } from "@/plugins/bus.js";

export default {
  components: {
    vitaboxDashboard: VitaboxDashboard
  },
  data: () => {
    return {
      vitaboxUsers: null
    };
  },
  methods: {
    goToVitaboxDetails(vitaboxData) {
      this.$store.commit("setVitaboxData", vitaboxData);
      this.$router.push("/vitabox/detail");
    }
  }
};
</script>

<style>
.vitaboxDetailsSelector {
   -moz-box-shadow:    inset 0 0 10px #000000;
   -webkit-box-shadow: inset 0 0 10px #000000;
   box-shadow:         inset 0 0 5px #000000;
}

.vitaboxDetailsSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

.dashboardMain {
  background-color: #3faf7d !important;
  width:100%;
  padding-left:250px; 
  padding-top:5px; 
  padding-right:0px;
  padding-bottom:0px;
}
</style>
