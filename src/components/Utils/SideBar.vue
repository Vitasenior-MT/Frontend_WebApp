<template>
  <div class="sidebar">
     <v-navigation-drawer id="sideNav" v-model="sideNav" clipped fixed app temporary>
        <v-list v-if="logged" dense class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src = {{ $store.state.photo }} >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $store.state.user.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      <v-list dense>
        <v-list-tile v-if="!logged" v-for="item in menuItemsNotLogged" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="logged" v-for="item in menuItemsLogged" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="logged" flat @click.native="logout">
          <v-list-tile-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  data() {
    return {
      logged: localStorage.getItem("token") ? true : false,
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
      ]
    };
  },
  mounted() {
    event_bus.$on("navigate", path => this.navigateTo(path));
    event_bus.$on("login", () => (this.logged = true));
  },
  methods: {
    logout() {
      this.logged = false;
      event_bus.$data.token = null;
      localStorage.removeItem("token");
      this.$router.push("logout");
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
