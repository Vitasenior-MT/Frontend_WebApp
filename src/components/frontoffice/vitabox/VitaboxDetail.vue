<template>
  <v-content>
    <v-card dark width="100%" class="pb-1">
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 style="position:relative;height:30px;">
            <div>
              <h1 class="primary_l--text main-title mb-0">
                Vitabox -
                <span class="thin">{{ this.$store.state.vitabox.address}}</span>
              </h1>
            </div>
          </v-flex>
          <v-flex xs4>
            <p class="mb-0 body-1 primary--text">ID</p>
            <p class="mb-0 body-2">{{ $store.state.vitabox.id }}</p>
          </v-flex>
          <v-flex xs2 md1 offset-md1>
            <p class="mb-0 body-1 primary--text">Registered</p>
            <p class="mb-0 body-2" v-if="this.$store.state.vitabox.registered === true">
              <v-icon>fas fa-check</v-icon>
            </p>
            <p class="mb-0 body-2" v-else>
              <v-icon>fas fa-times</v-icon>
            </p>
          </v-flex>
          <v-flex xs2 md1>
            <p class="mb-0 body-1 primary--text">Active</p>
            <p class="mb-0 body-2" v-if="this.$store.state.vitabox.active === true">
              <v-icon>fas fa-check</v-icon>
            </p>
            <p class="mb-0 body-2" v-else>
              <v-icon>fas fa-times</v-icon>
            </p>
          </v-flex>
          <v-flex xs1 offset-xs2 offset-md3>
            <send-notification :to_patient="false"></send-notification>
          </v-flex>
          <v-flex xs1>
            <vitabox-map></vitabox-map>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-card id="vitabox-tables" dark flat class="mt-2">
      <v-tabs centered color="primary" dark icons-and-text>
        <v-tabs-slider color="white"></v-tabs-slider>

        <v-tab href="#tab-patients">
          <span>Patients</span>
          <v-icon>fas fa-hand-holding-heart</v-icon>
        </v-tab>
        <v-tab href="#tab-boards">
          <span>Equipment</span>
          <v-icon>fas fa-microchip</v-icon>
        </v-tab>
        <v-tab href="#tab-users">
          <span>Users</span>
          <v-icon>fas fa-users</v-icon>
        </v-tab>

        <v-tab-item id="tab-patients">
          <patient-list></patient-list>
        </v-tab-item>
        <v-tab-item id="tab-boards">
          <board-list></board-list>
        </v-tab-item>
        <v-tab-item id="tab-users">
          <user-list></user-list>
        </v-tab-item>
      </v-tabs>
    </v-card>

    <v-btn dark class="ml-0 mt-2" @click="$router.go(-1)">
      <v-icon>fas fa-long-arrow-alt-left</v-icon>
      <span class="pl-1">Go Back</span>
    </v-btn>
  </v-content>
</template>

<script>
import BoardList from "@/components/frontoffice/board/BoardList.vue";
import PatientList from "@/components/frontoffice/patient/PatientList.vue";
import UserList from "@/components/frontoffice/user/UserList.vue";
import NotificationSend from "@/components/user/notification/NotificationCreate.vue";
import VitaboxMap from "@/components/frontoffice/vitabox/VitaboxMap.vue";

export default {
  components: {
    "patient-list": PatientList,
    "board-list": BoardList,
    "user-list": UserList,
    "send-notification": NotificationSend,
    "vitabox-map": VitaboxMap
  }
};
</script>

<style>
#vitabox-tables{
  min-height: 472px;
}
</style>
