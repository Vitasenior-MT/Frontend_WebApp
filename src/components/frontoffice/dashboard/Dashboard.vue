<template>
  <v-content v-if="this.$store.state.vitabox">
    <v-container class="pa-0" fluid grid-list-sm align-center>
      <v-layout class="pb-0" wrap>
        <v-flex xs12 sm12 md12 lg8 sl9 class="text-md-left pa-0">
          <v-card dark style="width:100%;">
            <v-layout row>
              <v-icon class="primary_d--text pt-0 pl-4">fa fa-compass</v-icon>
              <h4 class="pa-3">
                <span class="primary_l--text">Location:</span>
                <span class="pl-5">{{ this.$store.state.vitabox.address }}</span>
              </h4>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md12 lg4 sl3 class="pa-0">
          <v-layout>
            <v-card class="vitaboxDetailsSelector" dark style="height:54px; width:100%;" @click.native='goToVitaboxDetails($store.state.vitabox)'>
              <v-layout row>
                <v-icon class="primary_d--text pt-3 pl-5">fa fa-info-circle</v-icon>
                <h4 class="pt-3">
                  <span class="pl-4">Press for more details</span>
                </h4>
              </v-layout>
            </v-card>
          </v-layout>
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
    return {
      vitaboxUsers: []
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

.userDivider {
  background-color: black !important;
}

</style>
