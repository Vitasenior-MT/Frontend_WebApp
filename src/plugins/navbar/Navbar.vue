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
            <backoffice v-if="this.$store.state.user.as_admin"></backoffice>
            <doctoroffice v-else-if="this.$store.state.user.as_doctor"></doctoroffice>
            <frontoffice v-else></frontoffice>
          </div>
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
            :color="!(this.$store.state.user.as_doctor || this.$store.state.user.as_admin)?'raven':'primary'"
            class="white--text"
            @click="switchActivity"
          >{{$t('navbar.office')}}</v-btn>
        </v-toolbar-items>
        <user-profile></user-profile>
      </v-toolbar>
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
            <v-icon left dark>fas fa-sign-in-alt</v-icon>
            {{ $t('user.auth.login') }}
          </v-btn>
          <v-btn
            flat
            dark
            to="/Signup"
            color="grey lighten-1"
            class="top_bar_item"
          >{{ $t('user.auth.register') }}</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>
  </div>
</template>

<script>
import UserProfile from "./Profile.vue";
import Frontoffice from "./Frontoffice.vue";
import Backoffice from "./Backoffice.vue";
import Doctoroffice from "./Doctoroffice.vue";
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "navbar",
  data: () => {
    return {
      drawer: true,
      fixed: true
    };
  },
  mounted() {
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
      this.$store.commit("switchUserRole");
      event_bus.$emit(
        "switch_dashboard",
        this.$store.state.user.as_admin || this.$store.state.user.as_doctor
          ? false
          : true
      );
      if (this.$store.state.user.as_admin) {
        this.$router.push("/backoffice/vitabox/list");
      } else {
        this.$router.push("/alert/list");
      }
    },
    login() {
      if (this.$store.state.user.as_admin) {
        this.$router.push("/backoffice/vitabox/list");
      } else {
        this.$router.push("/alert/list");
      }
      event_bus.$emit("waiting", false);
    }
  },
  components: {
    "user-profile": UserProfile,
    frontoffice: Frontoffice,
    backoffice: Backoffice,
    doctoroffice: Doctoroffice
  }
};
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
  height: calc(100% - 64px);
  position: relative;
  overflow-y: auto;
}
</style>