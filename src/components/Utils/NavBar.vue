<template>
    <div id="navbar">
      <v-navigation-drawer id="sideNav" v-model="sideNav" clipped fixed app temporary>
        <v-list v-if="logged" dense class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img class="avatar_pic" :src="photo" /> 
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $store.state.user.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      <v-list dense>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="logged" @click.native="logout">
          <v-list-tile-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
       <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.native.stop="sideNav = !sideNav" >
        <v-icon>mdi-menu</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
        <v-avatar size="25px">
          <img src="/static/img/icons/favicon-32x32.png">
        </v-avatar>  
        Vitasenior
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="text-xs-center">
        <v-btn v-if="!logged" flat v-for="item in menuItemsNotLogged" :key="item.title" :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn v-if="logged" fab flat small >
          <v-icon dark small>mdi-bell</v-icon>
        </v-btn>
        <v-btn v-if="logged" flat v-for="item in menuItemsLogged" :key="item.title" :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn v-if="logged" flat @click.native="logout">
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "navbar",
  data() {
    return {
      logged: false,
      sideNav: false,
      menuItemsLogged: [
        {
          icon: "mdi-view-dashboard",
          title: "View Vitaboxs",
          link: "/vitabox"
        },
        { icon: "mdi-account", title: "Profile", link: "/user/detail" }
      ],
      menuItemsNotLogged: [
        {
          icon: "mdi-account-multiple-plus",
          title: "Sign up",
          link: "/signup"
        },
        { icon: "mdi-login", title: "Sign in", link: "/signin" }
      ],
      menuItems: [],
      photo: null
    };
  },
  mounted() {
    this.logged = this.$store.state.user.token ? true : false;
    event_bus.$on("navigate", path => this.navigateTo(path));
    event_bus.$on("login", () => (this.logged = true));
  },
  watch: {
    logged(val) {
      if (val) {
        this.photo = event_bus.$data.url + '/file/' + this.$store.state.user.photo;
        this.menuItems = this.menuItemsLogged;
      } else {
         this.$store.commit("setUserData", {
            token: null,
            name: null,
            email: null,
            photo: null
          });
          this.$store.commit("setVitaboxData", null);
          this.$store.commit("setBoardData", null);
          this.$store.commit("setSensorData", null);
        this.$router.push("logout");
        this.menuItems = this.menuItemsNotLogged;
      }
    }
  },
  methods: {
    logout() {
      this.logged = false;
    },
    navigateTo(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style>
#sideNav {
  position: absolute;
  width: 200px !important;
  z-index: 1030;
}
</style>
