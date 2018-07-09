<template>
  <v-container id="dashboardMain" class="dashboardMain" fluid grid-list-sm align-center style="padding-left:250px; padding-top:0px; padding-right:0px">
    <v-layout wrap>
      <v-flex xs12 sm12 md12 lg4 sl4>
        <v-layout class="text-md-left">
          <v-card dark style="width:100%;">
          <v-avatar style="color:#3faf7d; ">
            <v-icon>fa fa-compass</v-icon>
          </v-avatar>
            <span style="color:#3faf7d;">Location:</span>
            <span style="padding-left:50px;">{{ this.$store.state.vitabox.address }}</span>
          </v-card>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4 sl4 style="padding:0px">
        <v-expansion-panel dark >
          <v-expansion-panel-content v-for="item in vitaboxUsers" :key="item.id" expand-icon="fas fa-angle-down">
            <div class="title" slot="header" ><v-icon color="primary" style="padding-right:10px">fas fa-user-tag</v-icon>Users from this vitabox:</div>
            <v-divider v-if="item == vitaboxUsers[0]" class="vitaboxDivider"></v-divider>
            <v-divider v-else class="vitaboxDivider" :inset="true"></v-divider>
            <v-card class="vitaboxUserSelector" @click.native="gotoUserProfile(item)" style="padding-top:10px; padding-bottom:10px;">
              <span class="title" style="color:#3faf7d;">Name:</span>
              <span style="padding-left:15px;">{{ item.name }}</span>
              <br>
              <span class="title" style="color:#3faf7d;">Email:</span>
              <span style="padding-left:15px;">{{ item.email }}</span>
            </v-card>
            <v-divider v-if="item == vitaboxUsers[vitaboxUsers.length-1]" class="vitaboxDivider"></v-divider>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm12 md12 lg4 sl4>
        <v-layout class="text-md-center">
          <v-card class="vitaboxDetailsSelector" dark style="height:100%; width:100%; padding-top:12px; padding-bottom:12px;" align-content-center align-center @click.native='goToVitaboxDetails($store.state.vitabox)'>
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
          console.log(this.vitaboxUsers);
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
}
</style>
