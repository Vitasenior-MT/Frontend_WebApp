<template>
  <div class="navbar">
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
          <v-icon dark small>mdi-message-text</v-icon>
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

export default {
  name: "navbar",
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