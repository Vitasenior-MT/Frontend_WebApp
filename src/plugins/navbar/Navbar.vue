<template>
  <div id="navbar">

    <div v-if="logged">
      <v-navigation-drawer v-if="fixed" app width="250" id="side_bar">
        <sidemenu :isadmin="isadmin"></sidemenu>
      </v-navigation-drawer>

      <v-navigation-drawer v-else v-model="drawer" app width="250" id="side_bar">
        <sidemenu :isadmin="isadmin"></sidemenu>
      </v-navigation-drawer>

      <v-toolbar fixed class="primary--text raven" id="top_bar">
        <v-btn v-if="logged" @click.stop="drawer=!drawer" flat dark icon><v-icon>fas fa-bars</v-icon></v-btn>
        <v-toolbar-title>
            <v-avatar size="25px"><img src="../../assets/logo.png"></v-avatar>Vitasenior
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <warning v-if="logged"></warning>
      </v-toolbar>
    </div>

    <div v-else>
      <v-toolbar class="primary--text raven" id="top_bar">
        <v-toolbar-title>
            <v-avatar size="25px"><img src="../../assets/logo.png"></v-avatar>Vitasenior
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat dark to="/Signin" class="top_bar_item"><v-icon left dark>fas fa-sign-in-alt </v-icon>Signin</v-btn>
          <v-btn flat dark to="/Signup" color="grey lighten-1" class="top_bar_item">Signup</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>
  </div>
</template>

<script>
import Warning from "./Warning.vue";
import Sidemenu from "./Sidemenu.vue";

export default {
  name: "navbar",
  props: {
    logged: Boolean,
    isadmin: Boolean
  },
  data: () => {
    return {
      drawer: false,
      fixed: true
    };
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    resize() {
      this.fixed = screen.width > 960 ? true : false;
    }
  },
  components: {
    warning: Warning,
    sidemenu: Sidemenu
  }
};
</script>

<style>
#side_bar {
  padding: 0;
}
#top_menu {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  height: 56px !important;
}
#top_bar {
  height: 56px !important;
}
.top_bar_item {
  height: 56px !important;
}
</style>