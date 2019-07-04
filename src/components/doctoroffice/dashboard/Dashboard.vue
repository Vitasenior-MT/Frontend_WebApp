<template>
  <v-content v-if="this.$store.state.patient">
    <v-container class="pa-0">
      <v-card color="transparent" dark flat class="pb-1">
        <v-list two-line>
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
          <v-card dark class="mb-1 py-2 mr-1">
            <v-layout row wrap dark class="pl-3 pr-2">
              <v-flex xs3 offset-md1 offset-lg0 lg2>
                <label class="body-1 primary--text">{{$t('frontoffice.patient.gender')}}</label>
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
                <label class="body-1 primary--text">{{$t('frontoffice.patient.age')}}</label>
                <br>
                <label class="subheading">
                  {{ this.calculate_age($store.state.patient.birthdate) }}
                  <label
                    class="body-1"
                  >({{ $store.state.patient.birthdate }})</label>
                </label>
              </v-flex>
              <v-flex xs3 md2>
                <label class="body-1 primary--text">{{$t('frontoffice.patient.weight')}}</label>
                <br>
                <label
                  class="subheading"
                >{{ this.$store.state.patient.weight ? this.$store.state.patient.weight + " kg": $t('dashboard.none') }}</label>
              </v-flex>
              <v-flex xs3 md2>
                <label class="body-1 primary--text">{{$t('frontoffice.patient.height')}}</label>
                <br>
                <label
                  class="subheading"
                >{{ this.$store.state.patient.height ? this.$store.state.patient.height + " m": $t('dashboard.none') }}</label>
              </v-flex>
              <v-flex xs6 md1>
                <edit-patient class="text-xs-right" :patient="this.$store.state.patient"></edit-patient>
              </v-flex>
              <v-flex xs10 md11>
                <label class="body-1 primary--text">{{$t('frontoffice.patient.info')}}</label>
                <br>
                <p
                  class="subheading mb1"
                >{{ this.$store.state.patient.info ? this.$store.state.patient.info : $t('dashboard.none') }}</p>
              </v-flex>
              <v-flex xs2 md1 class="text-xs-right">
                <v-tooltip left>
                  <v-btn slot="activator" icon dark @click="medication_dialog=true">
                    <v-icon color="info">fas fa-tablets</v-icon>
                  </v-btn>
                  <span>{{$t('frontoffice.patient.medication')}}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card>
          <patient-dashboard></patient-dashboard>
        </v-flex>

        <v-flex lg5>
          <v-tabs centered dark icons-and-text>
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab href="#tab-1">
              {{$t('frontoffice.patient.profiles')}}
              <v-icon>fas fa-clipboard</v-icon>
            </v-tab>
            <v-tab href="#tab-2">
              {{$t('frontoffice.patient.exams')}}
              <v-icon>fas fa-calendar-alt</v-icon>
            </v-tab>
            <v-tab-item value="tab-1">
              <profile-list></profile-list>
            </v-tab-item>
            <v-tab-item value="tab-2">
              <exam-list></exam-list>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="medication_dialog" width="500">
      <v-card>
        <v-card-title>
          <span class="headline primary_d--text">{{$t('frontoffice.patient.medication')}}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>medication_dialog=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div
            v-if="this.$store.state.patient.medication && this.$store.state.patient.medication.length>0"
          >
            <ul>
              <li
                v-for="medicine in $store.state.patient.medication"
                :key="medicine"
                class="subheading mb-1"
              >{{ medicine }}</li>
            </ul>
          </div>
          <p v-else class="subheading mb-1">{{$t('dashboard.none')}}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
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
  data: () => {
    return {
      medication_dialog: false
    };
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
</style>
