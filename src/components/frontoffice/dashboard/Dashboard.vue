<template>
  <v-content>
    <v-container class="pa-0" fluid grid-list-sm align-center>
      <v-layout wrap style="padding-bottom:0px">
        <v-flex class="text-md-center" xs12 style="padding:0px">
          <v-card dark style="width: 100%; padding-top: 30px; padding-bottom: 60px;" flat>
            <v-card-title primary-title>
              <div>
                <h1 class="main-title mb-0">
                  Vitabox - 
                  <span class="thin">
                    {{ this.$store.state.vitabox.address}}
                  </span>
                </h1>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md12 lg8 sl9 class="text-md-left" style="padding-top:2px; padding-left:0px; padding-right:0px; padding-bottom:0px">
          <v-card dark style="width:100%; height:56px;">
            <v-layout row>
              <v-avatar style="color:#3faf7d;">
                <v-icon>fa fa-compass</v-icon>
              </v-avatar>
              <h4 style="padding-top:12.5px;">
                <span style="color:#3faf7d;">Location:</span>
                <span style="padding-left:50px;">{{ this.$store.state.vitabox.address }}</span>
              </h4>
            </v-layout>
          </v-card>
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
