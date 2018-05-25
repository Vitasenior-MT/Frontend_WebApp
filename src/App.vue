<template>
  <v-app dark>
    <navbar></navbar>
    <main>
      <router-view></router-view>
    </main>
    <v-footer app fixed>
      <span>Copyright &copy; 2018 Vitasenior. All rights reserved</span>
    </v-footer>
    <log></log>
  </v-app>
</template>

<script>
import Log from "./components/Utils/Log.vue";
import { event_bus } from "@/plugins/bus.js";
import NavBar from './components/Utils/NavBar.vue';

export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    log: Log,
    navbar: NavBar
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
  margin-top: 20px;
}
</style>
