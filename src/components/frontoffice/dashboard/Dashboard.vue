<template>
  <v-content v-if="this.$store.state.vitabox">
    <v-container class="pa-0" fluid grid-list-sm align-center>
      <v-layout class="pb-0" wrap>
        <v-flex xs12 sm12 md12 lg8 sl9 class="pa-0">
          <v-card dark height="100%" width="100%">
          <v-layout wrap fill-height >
            <v-flex lg1 class="text-xs-center pt-3 pb-3">
              <v-icon class="primary_d--text">fa fa-compass</v-icon>
            </v-flex>
            <v-flex lg11 class="pt-3 pb-3">
              <span >{{ this.$store.state.vitabox.address }}</span>
            </v-flex>
          </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md12 lg4 sl3 class="pa-0">
          <v-card class="vitaboxDetailsSelector text-xs-center" dark height="100%" width="100%" @click.native='goToVitaboxDetails($store.state.vitabox)'>
            <v-layout wrap>
              <v-flex lg4 class="text-xs-right pt-3 pb-3">
                <v-icon class="primary_d--text">fa fa-info-circle</v-icon>
              </v-flex>
              <v-flex lg8 class="text-xs-center pt-3 pb-3">
                <span >Press for more details</span>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>  
      <vitaboxDashboard :vitabox="$store.state.vitabox"></vitaboxDashboard>
    </v-container> 
  </v-content> 
</template>

<script>
import VitaboxDashboard from "./VitaboxDashboard.vue";
import { event_bus } from "@/plugins/bus.js";

export default {
  components: {
    vitaboxDashboard: VitaboxDashboard
  },
  data: () => {
    return {};
  },
  methods: {
    goToVitaboxDetails(vitaboxData) {
      this.$store.commit("setVitaboxData", vitaboxData);
      this.$router.push("/frontoffice/vitabox/detail");
    }
  }
};
</script>

<style>
.vitaboxDetailsSelector {
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 5px #000000;
}

.vitaboxDetailsSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

.userDivider {
  background-color: black !important;
}
</style>
