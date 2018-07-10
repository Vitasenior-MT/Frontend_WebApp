<template>
  <div id="navbar" >

    <div v-if="logged">
      <v-navigation-drawer app fixed v-model="drawer" width="250" class="pa-0">
        <sidemenu :isadmin="isadmin"></sidemenu>
      </v-navigation-drawer>

      <v-toolbar fixed class="primary--text raven" >
        <v-btn @click.stop="drawer = !drawer" flat dark icon><v-icon>fas fa-bars</v-icon></v-btn>
        <v-toolbar-title>
          <v-avatar><img src="../../assets/logo.png"></v-avatar>Vitasenior
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <warning :isadmin="isadmin"></warning>
        </v-toolbar-items>
      </v-toolbar>
    </div>

    <div v-else>
      <v-toolbar app fixed class="primary--text raven" >
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
      drawer: true,
      fixed: true
    };
  },
  watch: {
    drawer(x) {
      console.log(x);
    }
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
