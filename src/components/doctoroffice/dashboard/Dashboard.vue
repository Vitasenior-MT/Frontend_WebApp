<template>
  <v-content v-if="this.$store.state.patient">
    <v-container class="pa-0">
      <v-layout row wrap>
        <v-flex xs12 class="pa-0">
          <v-layout class="text-md-center">
            <v-card dark class="pb-3" width="100%" flat>
              <v-card-title primary-title>
                <h1 class="main-title mb-0 primary_l--text">Patient - <span class="thin"> {{ $store.state.patient.name}} </span></h1>
              </v-card-title>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex sm12 md5 lg3 class="pb-1 pl-0 pt-0 pr-0">
          <v-layout fill-height>
            <v-card dark width="100%" height="100%" class="text-xs-center" flat>
              <v-avatar class="patientAvatar" size="150px"><img src="@/assets/logo.png"></v-avatar>
              <v-list dark >
                <v-list-tile >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-xs-center primary--text">ID</v-list-tile-title>
                    <v-list-tile-sub-title class="text-xs-center">{{ $store.state.patient.id }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content >
                    <v-list-tile-sub-title class="text-xs-center primary--text">Birthdate</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ $store.state.patient.birthdate }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Gender</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ $store.state.patient.gender }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Weight</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ $store.state.patient.weight }} kg</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Height</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ $store.state.patient.height }} m</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex class="pa-0 hidden-sm-and-down" md7 lg9>
          <patient-dashboard></patient-dashboard>
        </v-flex>
      </v-layout>

      <v-flex xs12 class="ma-0">
        <profile-list></profile-list>
      </v-flex>

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
