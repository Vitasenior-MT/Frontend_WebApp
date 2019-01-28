<template>
  <v-content v-if="this.$store.state.patient">
    <v-container class="pa-0">
      <v-card color="transparent" dark flat class="pb-1">
        <v-list two-line id="patientBanner">
          <v-list-tile>
            <v-list-tile-avatar size="70">
              <img src="@/assets/logo.png">
            </v-list-tile-avatar>
            <v-list-tile-content class="pl-3">
              <v-list-tile-title
                class="display-1 primary_l--text"
                style="height:auto;"
              >{{ this.$store.state.patient.name}}</v-list-tile-title>
              <v-list-tile-sub-title class="asg--text">{{ this.$store.state.patient.id}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <send-notification class="text-xs-right" :to_patient="true"></send-notification>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>

      <v-layout row wrap>
        <v-flex lg7 class="mb-1">
          <patient-dashboard :selectedPatient="this.$store.state.patient"></patient-dashboard>
        </v-flex>

        <v-flex lg5>
          <v-card dark class="mb-1 py-2">
            <v-layout row wrap dark class="pl-3 pr-2">
              <v-flex xs3 offset-md1 offset-lg0 lg2>
                <label class="body-1 primary--text">Gender</label>
                <br>
                <v-icon v-if="$store.state.patient.gender == 'male'" class="cyan--text">fas fa-mars</v-icon>
                <v-icon
                  v-if="$store.state.patient.gender == 'female'"
                  class="pink--text"
                >fas fa-venus</v-icon>
                <v-icon
                  v-if="$store.state.patient.gender == 'undefined'"
                  class="pink--text"
                >fas fa-times-circle</v-icon>
              </v-flex>
              <v-flex xs9 md4 lg5>
                <label class="body-1 primary--text">Age</label>
                <br>
                <label class="subheading">
                  {{ this.calculate_age($store.state.patient.birthdate) }}
                  <label
                    class="body-1"
                  >({{ $store.state.patient.birthdate }})</label>
                </label>
              </v-flex>
              <v-flex xs3 md2>
                <label class="body-1 primary--text">Weight</label>
                <br>
                <label
                  class="subheading"
                >{{ this.$store.state.patient.weight ? this.$store.state.patient.weight + " kg":'NaN' }}</label>
              </v-flex>
              <v-flex xs3 md2>
                <label class="body-1 primary--text">Height</label>
                <br>
                <label
                  class="subheading"
                >{{ this.$store.state.patient.height ? this.$store.state.patient.height + " m":'NaN' }}</label>
              </v-flex>
              <v-flex xs6 md1>
                <edit-patient class="text-xs-right" :patient="this.$store.state.patient"></edit-patient>
              </v-flex>
            </v-layout>
          </v-card>

          <v-tabs centered dark icons-and-text>
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab href="#tab-1">Profiles
              <v-icon>fas fa-clipboard</v-icon>
            </v-tab>
            <v-tab href="#tab-2">Exams
              <v-icon>fas fa-calendar-alt</v-icon>
            </v-tab>
            <v-tab-item id="tab-1">
              <profile-list></profile-list>
            </v-tab-item>
            <v-tab-item id="tab-2">
              <exam-list></exam-list>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import ProfileList from "@/components/doctoroffice/profile/ProfileList.vue";
import ExamList from "@/components/doctoroffice/exam/ExamList.vue";
import PatientDashboard from "@/components/doctoroffice/dashboard/PatientDashboard.vue";
import PatientEdit from "@/components/doctoroffice/patient/PatientEdit.vue";
import NotificationSend from "@/components/user/notification/NotificationCreate.vue";

export default {
  components: {
    "profile-list": ProfileList,
    "exam-list": ExamList,
    "patient-dashboard": PatientDashboard,
    "edit-patient": PatientEdit,
    "send-notification": NotificationSend
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
#patientBanner {
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 5px #000000;
  position: relative;
}
</style>
