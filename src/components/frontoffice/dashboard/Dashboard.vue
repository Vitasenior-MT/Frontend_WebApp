<template>
  <v-content v-if="this.$store.state.vitabox">
    <v-container class="pa-0" fluid grid-list-sm align-center>
      <v-layout class="pb-0" wrap>
        <v-card dark height="100%" width="100%" class="vitaboxDetailsSelector" @click.native='goToVitaboxDetails($store.state.vitabox)'>
          <v-layout wrap fill-height>
            <v-flex xs1 class="text-xs-center py-3">
              <v-icon class="primary_d--text">fa fa-compass</v-icon>
            </v-flex>
            <v-flex xs10 class="py-3">
              <span >{{ this.$store.state.vitabox.address }}</span>
            </v-flex>
            <v-flex xs1>
              <v-tooltip bottom >
                <v-icon slot="activator" class="primary_d--text pt-1">fa fa-info-circle</v-icon>
                <span>Vitabox Details</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-card>
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
  position: relative;
}

.vitaboxDetailsSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

.userDivider {
  background-color: black !important;
}
</style>
