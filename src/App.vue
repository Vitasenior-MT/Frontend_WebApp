<template>
  <v-app>
    <v-navigation-drawer id="sideNav" v-model="sideNav" temporary>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary">
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          Vitasenior
        </router-link>
      </v-toolbar-title>
      <v-toolbar-side-icon @click.native.stop="sideNav = !sideNav" class="hidden-sm-and-up">
        <v-icon>mdi-menu</v-icon>
       </v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <img src="./assets/logo.png" alt="Vue.js PWA">
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      sideNav: false,
      menuItems: [
        { icon: "mdi-view-dashboard", title: "View Vitaboxs", link: "/vitabox" },
        { icon: "mdi-remote", title: "View Sensors", link: "/sensor" },
        { icon: "mdi-account", title: "Profile", link: "/user" },
        { icon: "mdi-account-multiple-plus", title: "Sign up", link: "/signup"},
        { icon: "mdi-login", title: "Sign in", link: "/signin" },
        { icon: "mdi-logout", title: "Log out", link: "/logout" }
      ]
    };
  }
};
</script>

<style>
@import "https://cdn.materialdesignicons.com/2.1.19/css/materialdesignicons.min.css";

body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

#sideNav {
  position: absolute;
  width: 200px !important;
  z-index: 1030;
}

</style>
