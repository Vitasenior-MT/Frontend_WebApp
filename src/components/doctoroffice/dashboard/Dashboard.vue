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
          <patient-dashboard :patient="this.$store.state.patient"></patient-dashboard>
        </v-flex>
      </v-layout>

      <v-layout row wrap class="pb-4">
        <v-flex sm12 md5 lg3 class="pa-0" id="patientProfile">
          <v-layout fill-height>
            <v-card dark width="100%" height="100%" class="text-xs-center" flat>
              <v-card-media height="210px"><img src="@/assets/logo.png"></v-card-media>
              <v-card-text class="py-0">
                <v-list dark class="py-0">
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-sub-title class="body-1 primary--text">Gender</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-icon v-if="$store.state.patient.gender == 'male'" class="cyan--text" large>fas fa-mars</v-icon>
                      <v-icon v-if="$store.state.patient.gender == 'female'" class="pink--text" large>fas fa-venus</v-icon>
                      <v-icon v-if="$store.state.patient.gender == 'undefined'" class="pink--text" large>fas fa-times-circle</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-sub-title class="body-1 primary--text">Weight</v-list-tile-sub-title>
                      <v-list-tile-title>{{ this.$store.state.patient.weight ? this.$store.state.patient.weight + " kg":'NaN' }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <edit-patient :patient="this.$store.state.patient"></edit-patient>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-sub-title class="body-1 primary--text">Height</v-list-tile-sub-title>
                      <v-list-tile-title>{{ this.$store.state.patient.height ? this.$store.state.patient.height + " m":'NaN' }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-sub-title class="body-1 primary--text">Age</v-list-tile-sub-title>
                      <v-list-tile-title >{{ this.calculate_age($store.state.patient.birthdate) }} <label class="body-1">({{ $store.state.patient.birthdate }})</label></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card-text>
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
import PatientEdit from "@/components/doctoroffice/patient/PatientEdit.vue";

export default {
  components: {
    "profile-list": ProfileList,
    "patient-dashboard": PatientDashboard,
    "edit-patient": PatientEdit
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

.patientAvatar {
  margin-top: 20px;
}

#patientProfile {
  height: 415px;
}
</style>
