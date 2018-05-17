<template>
  <v-app>
    
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="sideNav = !sideNav"
      class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>Vitasenior</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat>
          <v-icon left>mdi-view-dashboard</v-icon>
          View Boards
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer v-model="sideNav" temporary>
      <v-list>
        <v-list-title>
          <v-list-title-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-title-action>
          <v-list-title-content>View Boards</v-list-title-content>
        </v-list-title>
      </v-list>
    </v-navigation-drawer>
    <main>
      <img src="./assets/logo.png" alt="Vue.js PWA">
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      sideNav: false
    }
  }
}
</script>

<style>
@import "https://cdn.materialdesignicons.com/2.1.19/css/materialdesignicons.min.css";
 
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
