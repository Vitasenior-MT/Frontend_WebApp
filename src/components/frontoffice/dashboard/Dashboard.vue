<template>
  <v-container id="dashboardMain" class="dashboardMain" fluid grid-list-sm align-center>
    <v-layout wrap>
      <v-flex xs12 sm12 md12 lg4 sl4>
        <v-layout class="text-md-left">
          <v-card dark style="width:100%; height:56px;">
          <v-avatar style="color:#3faf7d; ">
            <v-icon>fa fa-compass</v-icon>
          </v-avatar>
            <span style="color:#3faf7d;">Location:</span>
            <span style="padding-left:50px;">{{ this.$store.state.vitabox.address }}</span>
          </v-card>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4 sl4 style="padding:0px">
        <v-menu offset-y transition="slide-y-transition" style="width:100%;">
          <v-card slot="activator" dark style="width:100%;">
            <v-card-title class="title">
              <v-icon color="primary" style="padding-right:10px">fas fa-user-tag</v-icon>
              Users from this vitabox:
              <v-spacer></v-spacer>
              <v-icon>fas fa-angle-down</v-icon>
            </v-card-title>
          </v-card>
          <v-list>
            <v-template dark v-for="item in vitaboxUsers" :key="item.id" @click="gotoUserProfile(item)">
              <v-divider v-if="item == vitaboxUsers[0]" class="userDivider"></v-divider>
              <v-divider v-else class="userDivider" :inset="true"></v-divider>
              <v-list-tile avatar class="vitaboxUserSelector">
                <v-list-tile-avatar style="color:#3faf7d"><img src="@/assets/logo.png"></v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                  <v-list-tile-sub-title>Name</v-list-tile-sub-title>
                </v-list-tile-content> 
              </v-list-tile>
              <v-divider v-if="item == vitaboxUsers[vitaboxUsers.length-1]" class="userDivider"></v-divider>
            </v-template>
          </v-list>
        </v-menu>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4 sl4>
        <v-layout class="text-md-center">
          <v-card class="vitaboxDetailsSelector" dark style="height:56px; width:100%; padding-top:12px; padding-bottom:12px;" align-content-center align-center @click.native='goToVitaboxDetails($store.state.vitabox)'>
            <span class="white--text" style="padding-right:50px;">
                <v-icon color="primary" style="width:50px;">fas fa-info-circle</v-icon> Press for more details on Vitabox
            </span>
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>  
    <vitaboxDashboard :selectedVitabox="$store.state.vitabox"></vitaboxDashboard>
  </v-container>  
</template>

<script>
import VitaboxDashboard from "./VitaboxDashboard.vue";
import { event_bus } from "@/plugins/bus.js";

export default {
  components: {
    vitaboxDashboard: VitaboxDashboard
  },
  data: () => {
    return {
      vitaboxUsers: null
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/user")
        .then(response => {
          this.vitaboxUsers = response.data.users;
          event_bus.$emit("waiting", false);
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", { message: error.message, type: "error" });
          }
          event_bus.$emit("waiting", false);
        });
    },
    goToVitaboxDetails(vitaboxData) {
      this.$router.push("/vitabox/detail");
    },
    gotoUserProfile(user){
      this.$router.push("/user/detail");
    }
  }
};
</script>

<style>
.vitaboxDetailsSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

.vitaboxUserSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

.dashboardMain {
  background-color: #3faf7d !important;
  padding-left:250px; 
  padding-top:0px; 
  padding-right:0px;
}

.userDivider {
  background-color: black !important;
}
</style>
