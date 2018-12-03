<template>
  <v-content>
    <v-layout wrap>
      <v-flex class="pt-0 text-md-center" xs12>
        <v-card dark width="100%" class="pb-1" flat>
          <v-card-title primary-title>
            <div>
              <h1 class="primary_l--text main-title mb-0">
                Vitabox - 
                <span class="thin">
                  {{ this.$store.state.vitabox.address}}
                </span>
              </h1>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-list dark>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">ID</v-list-tile-sub-title>
              <v-list-tile-title>{{ $store.state.vitabox.id }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content >
              <v-list-tile-sub-title class="primary--text">Registered</v-list-tile-sub-title>
              <v-list-tile-title v-if="this.$store.state.vitabox.registered === true"><v-icon >fas fa-check</v-icon></v-list-tile-title>
              <v-list-tile-title v-else><v-icon>fas fa-times</v-icon></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">Active</v-list-tile-sub-title>
              <v-list-tile-title v-if="this.$store.state.vitabox.active === true"><v-icon >fas fa-check</v-icon> </v-list-tile-title>
              <v-list-tile-title  v-else><v-icon>fas fa-times</v-icon> </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content>
              <send-notification :to_patient="false"></send-notification>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12 class="pa-0">
        <div id="google-map-box"></div>
      </v-flex>
      <v-flex xs12 class="pt-1">

          <v-card dark flat height="100%">
            <v-tabs centered color="primary" dark icons-and-text>
              <v-tabs-slider color="white"></v-tabs-slider>
              
              <v-tab href="#tab-patients">
                <span>Patients</span>
                <v-icon>fas fa-hand-holding-heart</v-icon>
              </v-tab>
              <v-tab href="#tab-boards">
                <span>Boards</span>
                <v-icon>fas fa-microchip</v-icon>
              </v-tab>
              <v-tab href="#tab-users">
                <span>Users</span>
                <v-icon>fas fa-users</v-icon>
              </v-tab>

              <v-tab-item id="tab-patients"><patient-list></patient-list></v-tab-item>
              <v-tab-item id="tab-boards"><board-list></board-list></v-tab-item>
              <v-tab-item id="tab-users"><user-list></user-list></v-tab-item>

            </v-tabs>   
          </v-card>
      </v-flex>
    </v-layout>

    <v-flex class="pb-2 pt-1">
      <v-btn dark class="ml-0" @click="$router.go(-1)">
        <v-icon>fas fa-long-arrow-alt-left </v-icon> <span class="pl-1"> Go Back</span>
      </v-btn>
    </v-flex>
  </v-content>
</template>

<script>
import BoardList from "@/components/frontoffice/board/BoardList.vue";
import PatientList from "@/components/frontoffice/patient/PatientList.vue";
import UserList from "@/components/frontoffice/user/UserList.vue";
import NotificationSend from "@/components/frontoffice/notification/NotificationCreate.vue";

export default {
  components: {
    "patient-list": PatientList,
    "board-list": BoardList,
    "user-list": UserList,
    "send-notification": NotificationSend
  },
  data() {
    return {
      map: null,
      marker: null
    };
  },
  mounted() {
    let myLatLng = new google.maps.LatLng(
      this.$store.state.vitabox.latitude,
      this.$store.state.vitabox.longitude
    );
    this.map = new google.maps.Map(document.getElementById("google-map-box"), {
      zoom: 15,
      center: myLatLng
    });
    this.marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: this.$store.state.vitabox.address
    });
  }
};
</script>

<style>
#google-map-box {
  width: 100%;
  height: 400px;
}
</style>
