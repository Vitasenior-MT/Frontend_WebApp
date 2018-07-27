<template>
  <v-content style="height:100%">
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
    </v-layout>
    <v-layout row wrap class="pb-1">
        <v-flex md12 lg4 class="pa-0">
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
                </v-list-tile>
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
        <v-flex md12 lg8>
        <v-card dark flat height="100%">
          <v-tabs centered color="primary" dark icons-and-text>
            <v-tabs-slider color="white"></v-tabs-slider>
            <v-tab href="#tab-profiles">
              Profiles
              <v-icon>fas fa-clipboard</v-icon>
            </v-tab>
            <v-tab href="#tab-doctors">
              Doctors
              <v-icon>fas fa-user-md</v-icon>
            </v-tab>
            <v-tab href="#tab-boards">
              Boards
              <v-icon>fas fa-microchip</v-icon>
            </v-tab>
            <v-tab-item id="tab-profiles"><profile-list></profile-list></v-tab-item>
            <v-tab-item id="tab-doctors"><doctor-list></doctor-list></v-tab-item>
            <v-tab-item id="tab-boards"><board-list></board-list></v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
    <v-flex class="pb-2">
      <v-btn dark class="ml-0" @click="$router.go(-1)">
        <v-icon>fas fa-long-arrow-alt-left </v-icon> <span class="pl-1"> Go Back</span>
      </v-btn>
    </v-flex>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import ProfileList from "@/components/frontoffice/profile/ProfileList.vue";
import DoctorList from "@/components/frontoffice/patient/DoctorList.vue";
import BoardList from "@/components/frontoffice/patient/PatientBoardList.vue";

export default {
  components: {
    "profile-list": ProfileList,
    "doctor-list": DoctorList,
    "board-list": BoardList
  },
  data() {
    return {

    };
  },
  methods: {
    calculate_age(dob) {
      dob = new Date(dob);
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms);
      return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
  },
};
</script>

<style>
</style>
