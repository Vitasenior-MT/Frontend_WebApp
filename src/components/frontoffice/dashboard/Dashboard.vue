<template>
  <v-container class="dashboardMain" fluid grid-list-sm align-center style="padding-left:250px; padding-top:0px; padding-right:0px">
    <v-layout wrap>
      <v-flex xs12 sm12 md12 lg6 sl6>
        <v-layout class="text-md-left">
          <v-card dark style="width:100%; padding-bottom:10px; padding-top:10px;">
          <v-avatar style="color:#3faf7d; ">
            <v-icon>fa fa-compass</v-icon>
          </v-avatar>
            <span style="color:#3faf7d;">Location:</span>
            <span style="padding-left:50px;">{{ this.$store.state.vitabox.address }}</span>
          </v-card>
        </v-layout>
      </v-flex>
      <!-- <v-divider  class="vitaboxDivider" :vertical="true"></v-divider> -->
      <v-flex xs12 sm12 md12 lg6 sl6>
        <v-layout class="text-md-center">
          <v-card class="vitaboxDetailsSelector" dark style="height:100%; width:100%; padding-top:22px; padding-bottom:22px;" align-content-center align-center @click.native='goToVitaboxDetails($store.state.vitabox)'>
            <span class="white--text" style="padding-right:50px;">
                <v-icon color="green darken-3" style="width:50px;">fas fa-info-circle</v-icon> Press for more details on Vitabox
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
.vitaboxDetailsSelector:hover {
  /* color: yellow !important; */
  background-color: #5b5b5b !important;
}

.dashboardMain {
  background-color:#3faf7d !important;
}

</style>
