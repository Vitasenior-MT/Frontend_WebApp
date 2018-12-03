<template>
  <div id="navbar">
    <div v-if="this.$store.state.user.token">
      <v-navigation-drawer app fixed v-model="drawer" width="280" class="pa-0">
        <div id="sidemenu">
          <v-toolbar class="primary--text raven" id="top_menu">
            <v-toolbar-title>
              <v-avatar>
                <img src="../../assets/logo.png">
              </v-avatar>Vitasenior-MT
            </v-toolbar-title>
          </v-toolbar>

          <div id="body_menu" class="raven">
            <backoffice v-if="is_admin"></backoffice>
            <doctoroffice v-else-if="is_doctor"></doctoroffice>
            <frontoffice v-else></frontoffice>
          </div>

          <v-btn id="btn_logout" class="raven primary--text" @click="logout" block>
            <v-layout row class="pa-0">
              <v-flex xs4>
                <v-icon class="pa-0">fas fa-sign-out-alt</v-icon>
              </v-flex>
              <v-flex xs8 class="pa-0 text-xs-left">Logout</v-flex>
            </v-layout>
          </v-btn>
        </div>
      </v-navigation-drawer>

      <v-toolbar fixed class="primary--text raven">
        <v-btn @click.stop="drawer = !drawer" flat dark icon>
          <v-icon>fas fa-bars</v-icon>
        </v-btn>
        <v-toolbar-title>
          <v-avatar>
            <img src="../../assets/logo.png">
          </v-avatar>Vitasenior-MT
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            v-if="this.$store.state.user.is_doctor || this.$store.state.user.is_admin"
            :color="this.as_user?'raven':'primary'"
            class="white--text"
            @click="switchActivity"
          >OFFICE</v-btn>
          <notification></notification>
          <warning></warning>
          <v-btn @click="videocall_dialog = true" slot="activator" dark>
            <v-icon color="white">fas fa-video</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-dialog v-model="videocall_dialog" dark lazy max-width="700">
        <video-call @close="videocall_dialog=false"></video-call>
      </v-dialog>
    </div>

    <div v-else>
      <v-toolbar app fixed class="primary--text raven">
        <v-toolbar-title>
          <v-avatar size="25px">
            <img src="../../assets/logo.png">
          </v-avatar>Vitasenior-MT
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat dark to="/Signin" class="top_bar_item">
            <v-icon left dark>fas fa-sign-in-alt</v-icon>Signin
          </v-btn>
          <v-btn flat dark to="/Signup" color="grey lighten-1" class="top_bar_item">Signup</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>
  </div>
</template>

<script>
import Warning from "./Warning.vue";
import Videocall from "./Videocall.vue";
import Notification from "./Notification.vue";
import Frontoffice from "./Frontoffice.vue";
import Backoffice from "./Backoffice.vue";
import Doctoroffice from "./Doctoroffice.vue";
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "navbar",
  data: () => {
    return {
      drawer: true,
      fixed: true,
      is_admin: false,
      is_doctor: false,
      as_user: false,
      videocall_dialog: false
    };
  },
  mounted() {
    this.is_admin = this.$store.state.user.is_admin;
    this.is_doctor = this.$store.state.user.is_doctor;
    this.as_user =
      this.$store.state.user.is_admin || this.$store.state.user.is_doctor
        ? false
        : true;

    this.resize();
    window.addEventListener("resize", this.resize);
    event_bus.$on("login", this.login);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    resize() {
      this.fixed = screen.width > 960 ? true : false;
    },
    switchActivity() {
      if (this.as_user) {
        this.is_admin = this.$store.state.user.is_admin;
        this.is_doctor = this.$store.state.user.is_doctor;
        this.as_user = false;
        if (this.$store.state.user.is_admin) {
          this.$router.push("/backoffice/vitabox/list");
        } else this.$router.push("/doctoroffice/dashboard");
      } else {
        this.is_admin = false;
        this.is_doctor = false;
        this.as_user = true;
        this.$store.commit("setVitaboxData", null);
        this.$router.push("/frontoffice/dashboard");
      }
      event_bus.$emit("switch_dashboard", this.as_user);
    },
    login() {
      this.is_admin = this.$store.state.user.is_admin;
      this.is_doctor = this.$store.state.user.is_doctor;
      this.as_user =
        this.$store.state.user.is_admin || this.$store.state.user.is_doctor
          ? false
          : true;

      if (this.$store.state.user.is_admin) {
        this.$router.push("/backoffice/vitabox/list");
      } else if (this.$store.state.user.is_doctor) {
        this.$router.push("/doctoroffice/dashboard");
      } else {
        this.$router.push("/frontoffice/dashboard");
      }

      event_bus.$emit("waiting", false);
    },
    logout() {
      this.$router.push("/");
      this.$store.commit("cleanData");
    }
  },
  components: {
    "video-call": Videocall,
    warning: Warning,
    notification: Notification,
    frontoffice: Frontoffice,
    backoffice: Backoffice,
    doctoroffice: Doctoroffice
  }
};
</script>

</script>

<style>
#top_menu {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}
#sidemenu {
  height: 100%;
}
#body_menu {
  height: calc(100% - 64px - 36px);
  position: relative;
  overflow-y: auto;
}
#btn_logout {
  height: 36px;
  padding: 0;
  margin: 0;
  border-radius: 0;
}
#btn_logout > div > i {
  margin-right: 5px;
}
</style>