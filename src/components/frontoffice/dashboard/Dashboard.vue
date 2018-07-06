<template>
  <v-content fluid grid-list-sm >
     <v-flex d-flex xs12 sm12 md12 lg12 style="padding-bottom:5px">
        <v-card dark flat>
          <v-list v-if="this.$store.state.vitabox">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Location</v-list-tile-title>
                {{ this.$store.state.vitabox.address }}
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>ID</v-list-tile-title>
                {{ this.$store.state.vitabox.id }}
              </v-list-tile-content>
               <v-list-tile-content>
                <v-list-tile-title>Details</v-list-tile-title>
                <v-tooltip bottom>
                  <v-btn slot="activator" @click.native='goToVitaboxDetails($store.state.vitabox)'>
                    <v-icon>fas fa-info-circle</v-icon>
                  </v-btn>
                  <span>Vitabox Details</span>
                </v-tooltip>
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
  }
};
</script>

<style>

</style>
