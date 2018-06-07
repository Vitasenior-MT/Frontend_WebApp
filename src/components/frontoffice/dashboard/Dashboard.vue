<template>
  <v-content fluid grid-list-sm style="margin-top:20px">
     <v-flex d-flex xs12 sm12 md12 lg12 >
        <v-card dark>
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Location</v-list-tile-title>
                {{ this.$store.state.vitabox.address }}
              </v-list-tile-content>
              <v-list-tile-content >
                <v-list-tile-title>Registered</v-list-tile-title>
                <v-icon v-if="this.$store.state.vitabox.registered === true">fas fa-check-circle</v-icon> 
                <v-icon v-else>fas fa-times-circle</v-icon>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>Active</v-list-tile-title>
                <v-icon v-if="this.$store.state.vitabox.active === true">fas fa-check-circle</v-icon> 
                <v-icon v-else>fas fa-times-circle</v-icon> 
              </v-list-tile-content>
               <v-list-tile-content>
                <v-list-tile-title>Details</v-list-tile-title>
                <v-btn @click='goToVitaboxDetails($store.state.vitabox)'>
                  <v-icon>fas fa-info-circle</v-icon>
                </v-btn>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>  
    <vitaboxDashboard :selectedVitabox="$store.state.vitabox"></vitaboxDashboard>
  </v-content>  
</template>


<script>
import VitaboxDashboard from "./VitaboxDashboard.vue";

export default {
  components: {
    vitaboxDashboard: VitaboxDashboard
  },
  methods: {
    goToVitaboxDetails(vitaboxData) {
      this.$store.commit("setVitaboxData", vitaboxData);
      this.$router.push("/vitabox/detail");
    }
  },
   watch: {
    selectedVitabox: function (val) {
      goToVitaboxDetails(val);
    }
  }
};
</script>

<style>
</style>
