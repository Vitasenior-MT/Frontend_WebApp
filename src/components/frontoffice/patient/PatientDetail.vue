<template>
  <v-content style="height:100%">
    <v-layout row wrap>
      <v-flex xs12 class="pa-0">
        <v-layout class="text-md-center">
          <v-card dark class="pb-3" width="100%" flat>
            <v-card-title>
              <div style="width:100%;position:relative;">
                <p class="text-xs-center mb-0">
                  <label
                    class="primary_l--text headline font-weight-medium"
                  >{{$t('frontoffice.patient.patient')}} -</label>
                  <label class="headline font-weight-thin">{{ $store.state.patient.name}}</label>
                </p>
                <p class="grey--text text-xs-center mb-0 body-2">{{ $store.state.patient.id}}</p>
                <send-notification id="send_btn" :to_patient="true"></send-notification>
              </div>
            </v-card-title>
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="pt-1">
      <v-flex md12 lg4>
        <v-layout fill-height class="pl-1">
          <v-card dark width="100%" height="100%" class="text-xs-center" flat>
            <v-menu offset-y left dark open-on-hover id="edit_menu">
              <v-icon slot="activator" dark color="primary" class="mt-2 mr-2">fas fa-edit</v-icon>
              <div class="text-xs-right">
                <v-tooltip left>
                  <v-btn slot="activator" icon small @click.native="()=>update_patient_dialog=true">
                    <v-icon color="white">fas fa-clipboard-list</v-icon>
                  </v-btn>
                  <span>{{ $t("frontoffice.patient.update_info_tooltip") }}</span>
                </v-tooltip>
                <br>
                <v-tooltip left v-if="$store.state.vitabox.sponsor">
                  <v-btn @click="chg_photo_dialog=true" icon small slot="activator">
                    <v-icon color="white">fas fa-user-circle</v-icon>
                  </v-btn>
                  <span>{{$t('frontoffice.patient.edit_photo')}}</span>
                </v-tooltip>
              </div>
            </v-menu>

            <v-avatar size="150px" class="mt-3">
              <img v-if="patient_photo" :src="patient_photo">
              <img v-else src="@/assets/logo.png">
            </v-avatar>
            <table class="text-xs-left px-4 pt-4 mb-2" style="width:100%">
              <tr>
                <td class="primary--text">{{$t('frontoffice.patient.gender')}}</td>
                <td>
                  <v-icon
                    medium
                    v-if="$store.state.patient.gender == 'male'"
                    class="cyan--text"
                  >fas fa-mars</v-icon>
                  <v-icon
                    medium
                    v-if="$store.state.patient.gender == 'female'"
                    class="pink--text"
                  >fas fa-venus</v-icon>
                  <v-icon
                    medium
                    v-if="$store.state.patient.gender == 'undefined'"
                    class="pink--text"
                  >fas fa-times-circle</v-icon>
                </td>
              </tr>
              <tr>
                <td class="primary--text">{{$t('frontoffice.patient.weight')}}</td>
                <td
                  class="subheading"
                >{{ this.$store.state.patient.weight ? this.$store.state.patient.weight+'kg': $t('dashboard.none') }}</td>
              </tr>
              <tr>
                <td class="primary--text">{{$t('frontoffice.patient.height')}}</td>
                <td
                  class="subheading"
                >{{ this.$store.state.patient.height ? this.$store.state.patient.height+'m': $t('dashboard.none') }}</td>
              </tr>
              <tr>
                <td class="primary--text">{{$t('frontoffice.patient.age')}}</td>
                <td class="subheading">{{ this.calculate_age($store.state.patient.birthdate) }}</td>
              </tr>
              <tr>
                <td class="primary--text">{{$t('frontoffice.patient.birthdate')}}</td>
                <td class="subheading">{{ $store.state.patient.birthdate }}</td>
              </tr>
              <tr>
                <td class="primary--text">{{$t('frontoffice.patient.cc')}}</td>
                <td class="subheading">{{ $store.state.patient.cc }}</td>
              </tr>
              <tr>
                <td class="primary--text">{{$t('frontoffice.patient.nif')}}</td>
                <td class="subheading">{{ $store.state.patient.nif }}</td>
              </tr>
              <tr>
                <td colspan="2" class="primary--text">{{$t('frontoffice.patient.medication')}}</td>
              </tr>
              <tr
                v-if="$store.state.patient.medication && $store.state.patient.medication.length>0"
              >
                <td colspan="2">
                  <ul>
                    <li
                      v-for="medicine in $store.state.patient.medication"
                      :key="medicine"
                      class="subheading"
                    >{{ medicine }}</li>
                  </ul>
                </td>
              </tr>
              <tr v-else>
                <td>{{$t('dashboard.none')}}</td>
              </tr>
              <tr>
                <td colspan="2" class="primary--text">{{$t('frontoffice.patient.info')}}</td>
              </tr>
              <tr>
                <td
                  class="subheading"
                  colspan="2"
                >{{ $store.state.patient.info ? $store.state.patient.info : $t('dashboard.none') }}</td>
              </tr>
            </table>
          </v-card>
        </v-layout>
      </v-flex>
      <v-flex md12 lg8>
        <v-card dark flat height="100%" class="ml-1">
          <v-tabs centered color="primary" dark icons-and-text>
            <v-tabs-slider color="white"></v-tabs-slider>
            <v-tab href="#tab-1">
              {{$t('frontoffice.patient.profiles')}}
              <v-icon>fas fa-clipboard</v-icon>
            </v-tab>
            <v-tab href="#tab-2">
              {{$t('frontoffice.patient.doctors')}}
              <v-icon>fas fa-user-md</v-icon>
            </v-tab>
            <v-tab href="#tab-3">
              {{$t('frontoffice.patient.boards')}}
              <v-icon>fas fa-microchip</v-icon>
            </v-tab>
            <v-tab-item v-for="i in 3" :value="'tab-' + i" :key="i">
              <v-data-table
                v-if="i == 1"
                :headers="headersProfiles"
                :items="$store.state.patient.Profiles"
                hide-actions
                class="elevation-1"
                dark
                sort-icon="fas fa-sort-down"
                no-data-text="no profiles related to the patient"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.measure }}</td>
                  <td class="text-xs-left">{{ props.item.min }}</td>
                  <td class="text-xs-left">{{ props.item.max }}</td>
                </template>
              </v-data-table>
              <add-doctor v-if="$store.state.vitabox.sponsor && i == 2"></add-doctor>
              <v-data-table
                v-if="i == 2"
                :headers="headersDoctors"
                :items="$store.state.patient.Doctors"
                hide-actions
                class="elevation-1"
                dark
                sort-icon="fas fa-sort-down"
                no-data-text="no doctors registered to the patient"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.email }}</td>
                  <td
                    class="text-xs-left"
                  >{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
                  <td class="justify-center layout px-0"></td>
                </template>
              </v-data-table>
              <add-board v-if="$store.state.vitabox.sponsor && i==3"></add-board>
              <v-data-table
                v-if="i == 3"
                :headers="headersBoards"
                :items="$store.state.patient.Boards"
                hide-actions
                class="elevation-1"
                dark
                sort-icon="fas fa-sort-down"
                no-data-text="no boards related to the patient"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    {{ props.item.Boardmodel.name }}
                    <label v-if="props.item.description">-</label>
                    {{ props.item.description}}
                  </td>
                  <td
                    class="text-xs-left"
                  >{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
                  <td
                    class="text-xs-left"
                  >{{ props.item.frequency ? props.item.frequency+" hours" : "none" }}</td>
                  <td>
                    <remove-board v-if="$store.state.vitabox.sponsor" :board="props.item"></remove-board>
                  </td>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>

    <v-btn dark class="ml-0" @click="$router.go(-1)">
      <v-icon>fas fa-long-arrow-alt-left</v-icon>
      <span class="pl-1">{{$t('dashboard.back')}}</span>
    </v-btn>

    <v-dialog max-width="600" v-model="chg_photo_dialog">
      <change-photo :to_patient="true" @changed="changePhoto" @close="chg_photo_dialog=false"></change-photo>
    </v-dialog>
    <v-dialog max-width="500px" v-model="update_patient_dialog">
      <edit-info @close="update_patient_dialog=false"></edit-info>
    </v-dialog>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SetBoard from "@/components/frontoffice/patient/SetBoard.vue";
import SetDoctor from "@/components/frontoffice/patient/SetDoctor.vue";
import EditInfo from "@/components/frontoffice/patient/PatientEditInfo.vue";
import RemoveBoard from "@/components/frontoffice/patient/RemoveBoard.vue";
import NotificationSend from "@/components/user/notification/NotificationCreate.vue";
import ChgPhoto from "@/components/user/utils/ChgPhoto.vue";

export default {
  data() {
    return {
      options: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      },
      measures: [],
      chg_photo_dialog: false,
      update_patient_dialog: false,
      headersProfiles: [
        {
          text: this.$t("frontoffice.patient.measure"),
          value: "measure",
          sortable: true
        },
        { text: this.$t("frontoffice.patient.min"), sortable: false },
        { text: this.$t("frontoffice.patient.max"), sortable: false }
      ],
      headersDoctors: [
        {
          text: this.$t("frontoffice.patient.name"),
          value: "name",
          sortable: true
        },
        { text: "Email", sortable: false },
        { text: this.$t("frontoffice.patient.since"), sortable: false }
      ],
      headersBoards: [
        {
          text: this.$t("frontoffice.patient.board"),
          value: "Boardmodel.name",
          sortable: true
        },
        { text: this.$t("frontoffice.patient.since"), sortable: false },
        { text: this.$t("frontoffice.patient.schedule"), sortable: false },
        { text: this.$t("frontoffice.patient.remove"), sortable: false }
      ],
      patient_photo: null
    };
  },
  mounted() {
    this.getMeasures();
    this.changePhoto();
  },
  methods: {
    calculate_age(dob) {
      dob = new Date(dob);
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    },
    getMeasures() {
      this.measures = [];
      if (this.$store.state.patient.Boards) {
        this.$store.state.patient.Boards.forEach(board => {
          board.Sensors.forEach(sensor => {
            this.measures.push({ text: sensor.Sensormodel.measure });
          });
        });
      }
    },
    changePhoto() {
      this.patient_photo = this.$store.state.patient.photo
        ? event_bus.$data.url + "/file/" + this.$store.state.patient.photo
        : null;
      this.chg_photo_dialog = false;
    }
  },
  components: {
    "add-board": SetBoard,
    "add-doctor": SetDoctor,
    "remove-board": RemoveBoard,
    "send-notification": NotificationSend,
    "change-photo": ChgPhoto,
    "edit-info": EditInfo
  }
};
</script>

<style>
#send_btn {
  position: absolute;
  top: 0;
  right: 5px;
}

#edit_menu {
  position: absolute;
  right: 0;
  z-index: 3;
}

.v-menu__content {
  min-width: 0 !important;
}
</style>
