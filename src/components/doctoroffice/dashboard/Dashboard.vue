<template>
  <v-content v-if="this.$store.state.patient">
    <v-container class="pa-0">
      <v-layout row wrap>
        <v-flex class="hidden-sm-and-down" >
          <div class="pb-2">
            <v-card color="transparent" flat>
              <v-layout class="pb-0" wrap>
                  <v-card dark height="100%" width="100%" id="patientBanner">
                    <v-layout wrap fill-height >
                      <v-flex xs4 md2 class="text-xs-center pt-3 pb-3">
                        <v-avatar tile size="70"><img src="@/assets/logo.png"></v-avatar>
                      </v-flex>
                      <v-flex xs8 md10 lg4 class="pt-3 pb-3">
                        <p class="display-1 primary_l--text mb-2">{{ this.$store.state.patient.name}}</p>
                        <p class="asg--text mb-1">{{ this.$store.state.patient.id}}</p>
                      </v-flex>
                      <v-flex xs12 lg6 id="patientInfoBoard">
                        <v-layout row wrap id="patientInfo">
                          <v-flex offset-(xs1 | md0)>
                            <v-list-tile>
                            <v-list-tile-content>
                              <v-list-tile-sub-title class="body-1 primary--text">Gender</v-list-tile-sub-title>
                            <v-list-tile-title>
                              <v-icon v-if="$store.state.patient.gender == 'male'" class="cyan--text">fas fa-mars</v-icon>
                              <v-icon v-if="$store.state.patient.gender == 'female'" class="pink--text">fas fa-venus</v-icon>
                              <v-icon v-if="$store.state.patient.gender == 'undefined'" class="pink--text">fas fa-times-circle</v-icon>
                            </v-list-tile-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          </v-flex>
                          <v-flex>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-sub-title class="body-1 primary--text">Age</v-list-tile-sub-title>
                                <v-list-tile-title >{{ this.calculate_age($store.state.patient.birthdate) }} <label class="body-1">({{ $store.state.patient.birthdate }})</label></v-list-tile-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-flex>
                          <v-flex>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-sub-title class="body-1 primary--text">Weight</v-list-tile-sub-title>
                                <v-list-tile-title>{{ this.$store.state.patient.weight ? this.$store.state.patient.weight + " kg":'NaN' }}</v-list-tile-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-flex>
                          <v-flex>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-sub-title class="body-1 primary--text">Height</v-list-tile-sub-title>
                                <v-list-tile-title>{{ this.$store.state.patient.height ? this.$store.state.patient.height + " m":'NaN' }}</v-list-tile-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-flex>
                          <v-flex>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-action>
                                  <edit-patient :patient="this.$store.state.patient"></edit-patient>
                                </v-list-tile-action>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card>
              </v-layout>

              <patient-dashboard :selectedPatient="this.$store.state.patient"></patient-dashboard>
            </v-card>
          </div>
        </v-flex>
      </v-layout>

      <v-tabs class="pb-4" centered dark icons-and-text>
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab href="#tab-1">Profiles<v-icon>fas fa-clipboard</v-icon></v-tab>
        <v-tab href="#tab-2">Exams<v-icon>fas fa-calendar-alt</v-icon></v-tab>
        <v-tab-item id="tab-1">
          <profile-list></profile-list>
        </v-tab-item>
        <v-tab-item id="tab-2">
          <exam-list></exam-list>
        </v-tab-item>
      </v-tabs>
    </v-container> 
  </v-content> 
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import ProfileList from "@/components/doctoroffice/profile/ProfileList.vue";
import ExamList from "@/components/doctoroffice/exam/ExamList.vue";
import PatientDashboard from "@/components/doctoroffice/dashboard/PatientDashboard.vue";
import PatientEdit from "@/components/doctoroffice/patient/PatientEdit.vue";

export default {
  components: {
    "profile-list": ProfileList,
    "exam-list": ExamList,
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
#patientBanner {
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 5px #000000;
  position: relative;
}

.vitaboxDetailsSelector {
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 5px #000000;
  position: relative;
}

.vitaboxDetailsSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

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

#patientInfoBoard {
  position: relative;
  min-height: 70px;
}

#patientInfo {
  position: absolute;
  top: 50%;
  bottom: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 48px;
}
</style>
