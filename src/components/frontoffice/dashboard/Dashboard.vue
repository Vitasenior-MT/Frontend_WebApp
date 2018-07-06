<template>
  <v-container fluid grid-list-sm align-center style="padding-left:250px; padding-top:0px; padding-right:0px">
    <v-layout wrap>
      <v-flex xs12 sm12 md12 lg6 sl6 style="padding:0px;">
        <v-card dark>
          <v-avatar style="color:#3faf7d; padding-top:20px">
            <v-icon>fa fa-compass</v-icon>
          </v-avatar>
            <span style="color:#3faf7d; padding-bot:0px">Location</span><br>
            <span style="padding-left:50px">{{ this.$store.state.vitabox.id }}</span>
        </v-card>
      </v-flex>
      <!-- <v-divider  class="vitaboxDivider" :vertical="true"></v-divider> -->
      <v-flex d-flex xs12 sm12 md12 lg6 style="padding:0px;">
        <v-card dark style="height:100%; padding-top:10px;" align-content-center align-center>
            <v-btn class="white--text" style="padding-right:50px;" round @click.native='goToVitaboxDetails($store.state.vitabox)'>
                <v-icon color="green darken-3" style="width:100px;">fas fa-info-circle</v-icon> Press for more details
            </v-btn>
        </v-card>
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

</style>
