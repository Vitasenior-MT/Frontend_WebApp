<template>
  <div id="sidemenu">
    <v-toolbar class="primary--text raven" id="top_menu">
      <v-toolbar-title v-if="isadmin"><v-avatar><img src="../../assets/logo.png"></v-avatar>Backoffice</v-toolbar-title>
      <v-toolbar-title v-else><v-avatar><img src="../../assets/logo.png"></v-avatar>Vitasenior</v-toolbar-title>
    </v-toolbar>
    
    <div id="body_menu" class="raven">
      <backoffice v-if="isadmin"></backoffice>
      <frontoffice v-else></frontoffice>
    </div>

    <v-btn id="btn_logout" class="raven primary--text" @click="logout" block>
      <v-layout row class="pa-0">
        <v-flex xs4><v-icon class="pa-0">fas fa-sign-out-alt</v-icon></v-flex>
        <v-flex xs8 class="pa-0 text-xs-left">Logout</v-flex>
      </v-layout>
    </v-btn>
  </div>
</template>

<script>
import Frontoffice from "./Frontoffice.vue";
import Backoffice from "./Backoffice.vue";
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "sidemenu",
  props: {
    isadmin: Boolean
  },
  data: () => {
    return {
      drawer: false
    };
  },
  methods: {
    logout() {
      event_bus.$data.token = null;
      event_bus.$emit("logout");
    }
  },
  components: {
    frontoffice: Frontoffice,
    backoffice: Backoffice
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
.office_notchoosen:hover {
  color: #daf1e7 !important;
}
.office_menu {
  padding-top: 5%;
}
</style>
