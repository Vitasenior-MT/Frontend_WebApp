<template>
  <v-content v-if="this.$store.state.patient">
    <v-container class="pa-0">
      <v-layout row wrap>
        <v-flex xs12 class="pa-0">
          <v-layout class="text-md-center">
            <v-card dark class="pb-3" width="100%" flat>
              <v-card-title primary-title>
                <h1 class="main-title pb-4 primary_l--text">Patient - <span class="thin"> {{ $store.state.patient.name}} </span></h1>
              </v-card-title>
              <v-card-text class="pt-3">
                <h5 class="grey--text"> {{ $store.state.patient.id}} </h5>
              </v-card-text>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex class="pa-0 hidden-sm-and-down" >
          <patient-dashboard></patient-dashboard>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="pb-4">
        <v-flex sm12 md5 lg3 class="pa-0">
          <v-layout fill-height>
            <v-card dark width="100%" height="100%" class="text-xs-center" flat>
              <v-avatar class="patientAvatar" size="150px"><img src="@/assets/logo.png"></v-avatar>
              <br/>
              <v-icon v-if="$store.state.patient.gender == 'male'" class="cyan--text">fas fa-mars</v-icon>
              <v-icon v-if="$store.state.patient.gender == 'female'" class="pink--text">fas fa-venus</v-icon>
              <v-icon v-if="$store.state.patient.gender == 'undefined'" class="pink--text">fas fa-times-circle</v-icon>
              <v-list dark >
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Weight</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.weight ? this.$store.state.patient.weight:'null' }} kg</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Height</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.height ? this.$store.state.patient.height:'null' }} m</v-list-tile-title>
                  </v-list-tile-content>
                  <v-btn icon class="mx-0" @click="editPatient()">
                    <v-icon color="teal">fas fa-edit</v-icon>
                  </v-btn>
                </v-list-tile>
                <!-- <v-divider class="vitaboxDivider"></v-divider> -->
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Age</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ this.calculate_age($store.state.patient.birthdate) }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Birthdate</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ $store.state.patient.birthdate }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex sm12 md7 lg9>
          <profile-list></profile-list>
        </v-flex>
      </v-layout>
    </v-container> 
  </v-content> 
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import ProfileList from "@/components/doctoroffice/profile/ProfileList.vue";
import PatientDashboard from "@/components/doctoroffice/dashboard/PatientDashboard.vue";

export default {
  components: {
    "profile-list": ProfileList,
    "patient-dashboard": PatientDashboard
  },
  methods: {
    calculate_age(dob) {
      dob = new Date(dob);
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
  }
};
</script>

<style>
.patientFlex {
  padding: 0px;
}

.patientBoardSelector {
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 5px #000000;
}

.patientBoardSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

.bioAvatar {
  padding-top: 10%;
  padding-left: 10px;
}

.bioLogo {
  height: 40px;
  width: 40px;
}

#bioGraph {
  height: 250px;
  position: relative;
}

.patientAvatar {
  margin-top: 20px;
}
</style>
