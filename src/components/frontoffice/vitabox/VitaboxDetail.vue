<template>
  <v-content>
    <v-card dark width="100%" class="pb-1">
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 md2>
            <p class="mb-0 body-1 primary--text">
              <v-icon
                v-if="this.$store.state.vitabox.registered === true"
                color="white"
              >fas fa-check</v-icon>
              <v-icon v-else color="white">fas fa-times</v-icon>
              {{ $t('frontoffice.vitabox.registered') }}
            </p>
            <p class="mb-0 body-1 primary--text">
              <v-icon v-if="this.$store.state.vitabox.active === true" color="white">fas fa-check</v-icon>
              <v-icon v-else color="white">fas fa-times</v-icon>
              {{ $t('frontoffice.vitabox.active') }}
            </p>
          </v-flex>
          <v-flex xs12 md8 style="position:relative;">
            <div style="width:100%;position:relative;">
              <p class="text-xs-center mb-0">
                <label class="primary_l--text headline font-weight-medium">Vitabox -</label>
                <label class="headline font-weight-thin">{{ this.$store.state.vitabox.address}}</label>
              </p>
              <p class="grey--text text-xs-center mb-0 body-2">{{ $store.state.vitabox.id}}</p>
            </div>
          </v-flex>
          <v-flex xs4 md2 class="text-xs-right d-inline-flex">
            <vitabox-map></vitabox-map>
            <send-notification :to_patient="false"></send-notification>
            <vitabox-edit></vitabox-edit>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-card id="vitabox-tables" dark flat class="mt-2">
      <v-tabs centered color="primary" dark icons-and-text>
        <v-tabs-slider color="white"></v-tabs-slider>

        <v-tab href="#tab-patients">
          <span>{{ $t('frontoffice.vitabox.patients') }}</span>
          <v-icon>fas fa-hand-holding-heart</v-icon>
        </v-tab>
        <v-tab href="#tab-boards">
          <span>{{ $t('frontoffice.vitabox.equipment') }}</span>
          <v-icon>fas fa-microchip</v-icon>
        </v-tab>
        <v-tab href="#tab-users">
          <span>{{ $t('frontoffice.vitabox.users') }}</span>
          <v-icon>fas fa-users</v-icon>
        </v-tab>

        <v-tab-item value="tab-patients">
          <patient-list></patient-list>
        </v-tab-item>
        <v-tab-item value="tab-boards">
          <board-list></board-list>
        </v-tab-item>
        <v-tab-item value="tab-users">
          <user-list></user-list>
        </v-tab-item>
      </v-tabs>
    </v-card>

    <v-btn dark class="ml-0" @click="$router.go(-1)">
      <v-icon>fas fa-long-arrow-alt-left</v-icon>
      <span class="pl-1">{{$t('dashboard.back')}}</span>
    </v-btn>
  </v-content>
</template>

<script>
import BoardList from "@/components/frontoffice/board/BoardList.vue";
import PatientList from "@/components/frontoffice/patient/PatientList.vue";
import UserList from "@/components/frontoffice/user/UserList.vue";
import NotificationSend from "@/components/user/notification/NotificationCreate.vue";
import VitaboxMap from "@/components/frontoffice/vitabox/VitaboxMap.vue";
import VitaboxEdit from "@/components/frontoffice/vitabox/VitaboxEdit.vue";

export default {
  components: {
    "patient-list": PatientList,
    "board-list": BoardList,
    "user-list": UserList,
    "send-notification": NotificationSend,
    "vitabox-map": VitaboxMap,
    "vitabox-edit": VitaboxEdit
  }
};
</script>

<style>
#vitabox-tables {
  min-height: 472px;
}
</style>
